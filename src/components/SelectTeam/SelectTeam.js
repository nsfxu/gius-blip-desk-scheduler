/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import propTypes from 'prop-types';

// eslint-disable-next-line import/named
import { BdsSelect, BdsSelectOption } from 'blip-ds/dist/blip-ds-react';

const SelectTeam = ({ parentCallback, allTeams }) => {
    const [selectedTeam, setSelectedTeam] = useState('');
    const { t } = useTranslation();

    const setAsSelected = (team) => {
        setSelectedTeam(team);
        parentCallback(team);
    };

    useEffect(() => {
        if (allTeams != null) {
            setAsSelected('Todos');
        }
    }, [allTeams]);

    if (allTeams !== null) {
        return (
            <>
                <BdsSelect
                    value={selectedTeam}
                    className="w-25"
                    dataTestId="teamSelector"
                >
                    <BdsSelectOption
                        value="Todos"
                        onClick={() => setAsSelected('Todos')}
                    >
                        Todas as equipes
                    </BdsSelectOption>
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
