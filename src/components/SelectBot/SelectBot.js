import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import propTypes from 'prop-types';

// eslint-disable-next-line import/named
import { BdsSelect, BdsSelectOption } from 'blip-ds/dist/blip-ds-react';

const SelectBot = ({ parentCallback, subBots }) => {
    const [selectedBot, setSelectedBot] = useState(null);
    const { t } = useTranslation();

    const getFirstBot = (response) => {
        if (response.total > 0) {
            const BOT_NAME = response.name;
            setAsSelected(BOT_NAME);
        }
    };

    const setAsSelected = (newBot) => {
        setSelectedBot(newBot);
        parentCallback(newBot);
    };

    useEffect(() => {
        if (subBots != null) {
            getFirstBot(subBots);
        }
    }, [subBots]);

    if (subBots != null) {
        // if (subBots.total === 1) {
        //     return (
        //         <>
        //             <BdsSelect value={selectedTeam} className="w-25">
        //                 <BdsSelectOption
        //                     value={selectedTeam}
        //                     onClick={() => setAsSelected(selectedTeam)}
        //                 >
        //                     {selectedTeam}
        //                 </BdsSelectOption>
        //             </BdsSelect>
        //         </>
        //     );
        // }
        return (
            <>
                <BdsSelect value={selectedBot} className="w-25">
                    {subBots?.map((value, key) => (
                        <BdsSelectOption
                            key={key}
                            value={value.name}
                            onClick={() => setAsSelected(value.name)}
                        >
                            {value.name}
                        </BdsSelectOption>
                    ))}
                </BdsSelect>
            </>
        );
    }

    return t('loading');
};

SelectBot.propTypes = {
    parentCallback: propTypes.any,
    subBots: propTypes.any
};

export default SelectBot;
