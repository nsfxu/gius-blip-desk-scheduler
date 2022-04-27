import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import propTypes from 'prop-types';

// eslint-disable-next-line import/named
import { BdsSelect, BdsSelectOption } from 'blip-ds/dist/blip-ds-react';

const SelectTeam = ({ parentCallback, allTeams }) => {
    const [selectedTeam, setSelectedTeam] = useState('');
    const { t } = useTranslation();

    const getFirstTeam = (response) => {
        if (response.total > 0) {
            const TEAM_NAME = response.items[0].name;
            setAsSelected(TEAM_NAME);
        }
    };

    const setAsSelected = (team) => {
        setSelectedTeam(team);
        parentCallback(team);
    };

    useEffect(() => {
        if (allTeams != null) {
            getFirstTeam(allTeams);
        }
    }, [allTeams]);

    if (allTeams != null) {
        if (allTeams.total === 1) {
            return (
                <>
                    <BdsSelect value={selectedTeam} className="w-25">
                        <BdsSelectOption
                            value={selectedTeam}
                            onClick={() => setAsSelected(selectedTeam)}
                        >
                            {selectedTeam}
                        </BdsSelectOption>
                    </BdsSelect>
                </>
            );
        }
        return (
            <>
                <BdsSelect value={selectedTeam} className="w-25">
                    {allTeams.items?.map((value, key) => (
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

SelectTeam.propTypes = {
    parentCallback: propTypes.any,
    allTeams: propTypes.any
};

export default SelectTeam;
