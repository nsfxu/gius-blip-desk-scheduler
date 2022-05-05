/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import propTypes from 'prop-types';

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
            <div className="w-25">
                <bds-select value={selectedTeam} data-testid="teamSelector">
                    <bds-select-option
                        value="Todos"
                        onClick={() => setAsSelected('Todos')}
                    >
                        Todas as equipes
                    </bds-select-option>
                    {allTeams.items?.map((value) => (
                        <bds-select-option
                            key={value.name}
                            value={value.name}
                            onClick={() => setAsSelected(value.name)}
                        >
                            {value.name}
                        </bds-select-option>
                    ))}
                </bds-select>
            </div>
        );
    }

    return t('loading');
};

SelectTeam.propTypes = {
    parentCallback: propTypes.any,
    allTeams: propTypes.any
};

export default SelectTeam;
