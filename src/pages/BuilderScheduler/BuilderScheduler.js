/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/named

import { BdsPaper } from 'blip-ds/dist/blip-ds-react';
import Header from '../../components/Header';
import SelectTeam from '../../components/SelectTeam/SelectTeam';
import Scheduler from '../../components/Scheduler/Scheduler';

import settings from '../../config';
import { getApplicationDataAsync } from '../../services/application-service';
import { getResourceAsync } from '../../services/resources-service';
import { getAllTeamsAsync } from '../../services/teams-service';
import { withLoadingAsync } from '../../services/common-service';
import { track } from '../../services/analytics-service';
import { EXTENSION_TRACKS } from '../../constants/trackings';
import { DEFAULT_TIME } from '../../constants/defaultTime';

const BLANK = '_blank';

const BuilderScheduler = () => {
    const [allTeams, setAllTeams] = useState(null);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [currentWorkTime, setCurrentWorkTime] = useState(null);
    const [currentResources, setCurrentResources] = useState(null);

    const [application, setApplication] = useState({ shortName: 'init' });

    // Return current bot data
    useEffect(() => {
        withLoadingAsync(async () => {
            setApplication(await getApplicationDataAsync());
            track(EXTENSION_TRACKS.open, {
                botId: application.name
            });
        });
    }, [application.shortName]);

    // Get all teams
    useEffect(() => {
        withLoadingAsync(async () => {
            // Get All Teams if is not already done
            if (allTeams == null) {
                try {
                    setAllTeams(await getAllTeamsAsync());
                    setCurrentTeam('Todos');
                    setCurrentWorkTime(getNameOfWorkTime('Todos'));
                } catch (error) {
                    return {};
                }
            }
        });
    });

    // Get work schedule info of a team
    useEffect(() => {
        withLoadingAsync(async () => {
            // Check if the currentWorkTime exists
            if (currentWorkTime !== null) {
                try {
                    const resourceTimes = await getResourceAsync(
                        currentWorkTime
                    );

                    if (resourceTimes.weekdays && resourceTimes.noWorkDays) {
                        setCurrentResources(resourceTimes);
                    } else {
                        setCurrentResources(DEFAULT_TIME);
                    }
                } catch (error) {
                    return {};
                }
            }
        });
    }, [currentWorkTime]);

    const callback = (newTeam) => {
        setCurrentTeam(newTeam);
        setCurrentWorkTime(getNameOfWorkTime(newTeam));
    };

    const getNameOfWorkTime = (team) => {
        if (team === 'Todos') {
            return 'workTime';
        }

        // change all spaces for underlines
        if (team.indexOf(' ') !== -1) {
            return `workTime-${team.replaceAll(' ', '_')}`;
        }

        return `workTime-${team}`;
    };

    return (
        <>
            <div className="ph1 ph4-m ph5-ns pb5">
                <Header
                    title="Blip desk scheduler"
                    onClick={() => window.open(settings.repositoryUrl, BLANK)}
                />

                {/* Team selector */}
                <BdsPaper className="pa4 mt4">
                    <div className="pb4 mb4 bb bw1 bp-bc-neutral-medium-wave">
                        <bds-typo
                            style={{ color: '#3A4A65' }}
                            margin={0}
                            variant="fs-24"
                            bold="bold"
                        >
                            Selecione a equipe
                        </bds-typo>

                        <bds-typo style={{ color: '#3A4A65' }} variant="fs-15">
                            Obs.: Só apareceram as equipes que tiverem pelo
                            menos um atendente atrelado.
                        </bds-typo>
                    </div>
                    {allTeams !== null ? (
                        <SelectTeam
                            parentCallback={callback}
                            allTeams={allTeams}
                        />
                    ) : (
                        <bds-select value="Todos" className="w-25">
                            <bds-select-option
                                value="Todos"
                                onClick={() => callback('Todos')}
                            >
                                Todas as equipes
                            </bds-select-option>
                        </bds-select>
                    )}
                </BdsPaper>

                {/* Scheduler options */}
                <div>
                    {currentResources !== null && currentWorkTime !== null ? (
                        <Scheduler
                            currentResources={currentResources}
                            currentWorkTime={currentWorkTime}
                            currentTeam={currentTeam}
                        />
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </>
    );
};

export default BuilderScheduler;
