import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Header from '../../components/Header';
import SelectTeam from '../../components/SelectTeam/SelectTeam';
import Scheduler from '../../components/Scheduler/Scheduler';
import Input from '../../components/Input';
import Button from '../../components/Button';

import ToastTypes from '../../constants/toast-type';
import settings from '../../config';
import { getApplicationDataAsync } from '../../services/application-service';
import {
    getResourceAsync,
    saveResourceAsync
} from '../../services/resources-service';
import { getAllTeams } from '../../services/api-service';
import { track } from '../../services/analytics-service';
import { EXTENSION_TRACKS } from '../../constants/trackings';
import { showToast, withLoadingAsync } from '../../services/common-service';
import { DEFAULT_TIME } from '../../constants/defaultTime';

const BLANK = '_blank';
const RESOURCE_NAME = 'botAttendanceKey';

const RouterScheduler = () => {
    const { t } = useTranslation();

    const [application, setApplication] = useState({ shortName: 'init' });
    const [attendanceBotKey, setAttendanceBotkey] = useState(null);

    const [allTeams, setAllTeams] = useState(undefined);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [currentWorkTime, setCurrentWorkTime] = useState(null);
    const [currentResources, setCurrentResources] = useState(null);

    // Return current router data
    useEffect(() => {
        withLoadingAsync(async () => {
            setApplication(await getApplicationDataAsync());
            track(EXTENSION_TRACKS.open, {
                botId: application.name
            });
        });
    }, [application.shortName]);

    // check if exists an attendanceBotKey on resources
    useEffect(() => {
        withLoadingAsync(async () => {
            if (attendanceBotKey === null) {
                try {
                    const resourceAttendanceBotKey = await getResourceAsync(
                        RESOURCE_NAME
                    );

                    if (resourceAttendanceBotKey.key) {
                        setAttendanceBotkey(resourceAttendanceBotKey.key);
                        RequestAllTeams(resourceAttendanceBotKey.key);
                    } else {
                        setAttendanceBotkey(null);
                    }
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

                    if (
                        resourceTimes.weekdays &&
                        resourceTimes.noWorkDays &&
                        !resourceTimes.name
                    ) {
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

    // ==================================
    // #region attendanceBotKey functions
    // ==================================

    // save a new key into resources
    const saveNewKey = async () => {
        withLoadingAsync(async () => {
            // check if the key is valid
            if (
                !attendanceBotKey.startsWith('Key ') ||
                attendanceBotKey.length < 40
            ) {
                hideOptions();
                showToast(
                    ToastTypes.DANGER,
                    'Error',
                    `A chave desse bot é inválida.`
                );

                return false;
            }

            // change it to JSON
            const attendanceBotKeyResource = {
                key: attendanceBotKey
            };

            const response = await saveResourceAsync(
                RESOURCE_NAME,
                attendanceBotKeyResource,
                'application/json'
            );

            RequestAllTeams(attendanceBotKey);

            if (response !== {}) {
                showToast(
                    ToastTypes.SUCCESS,
                    'Sucesso',
                    `Chave do bot alterada com sucesso.`
                );
            }
        });
    };

    const hideOptions = () => {
        setAllTeams(null);
        setCurrentResources(null);
    };

    // #endregion

    // ==================================
    // #region team selection functions
    // ==================================

    // request via HTTP #get-all-teams with the current attendanceBotKey
    const RequestAllTeams = async (botKey) => {
        withLoadingAsync(async () => {
            if (botKey !== null) {
                try {
                    const response = await getAllTeams(botKey);

                    // send a error messsage
                    // causes: The authorization key is invalid
                    if (response === 401) {
                        showToast(
                            ToastTypes.DANGER,
                            'Erro',
                            `Não foi possível buscar as equipes com a chave inserida.`
                        );
                    }

                    if (response.data.resource) {
                        hideOptions();
                        setAllTeams(response.data.resource);
                    } else {
                        setAllTeams(null);
                        setCurrentTeam('Todos');
                        setCurrentWorkTime(getNameOfWorkTime('Todos'));
                    }
                } catch (error) {
                    return error;
                }
            }
        });
    };

    // receive response from input selector of teams
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

    // #endregion

    return (
        <div className="ph1 ph4-m ph5-ns pb5">
            <Header
                title="Blip desk scheduler"
                onClick={() => window.open(settings.repositoryUrl, BLANK)}
            />

            {/* Bot selector */}
            <bds-paper data-testid="botContainer">
                <div className="pa4 mt4">
                    {/* Title container */}
                    <div className="pb4 mb4 bb bw1 bp-bc-neutral-medium-wave">
                        <bds-typo
                            style={{ color: '#3A4A65' }}
                            margin={5}
                            variant="fs-24"
                            bold="bold"
                        >
                            Bot de Atendimento Humano
                        </bds-typo>
                        <bds-typo style={{ color: '#3A4A65' }} variant="fs-15">
                            Insira a chave do seu bot de atendimento humano
                            abaixo.
                        </bds-typo>
                    </div>

                    {/* Inserting attendance bot key */}
                    <div className="flex">
                        <div className="w-80 pr3">
                            <Input
                                name="attendanceBotKey"
                                icon="robot"
                                placeholder="Key XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                                value={attendanceBotKey}
                                onChange={(e) => {
                                    setAttendanceBotkey(e.target.value);
                                }}
                            />
                        </div>
                        <div>
                            <Button
                                text={t('labels.save')}
                                icon="save-disk"
                                variant="primary"
                                arrow={false}
                                disabled={false}
                                onClick={() => {
                                    saveNewKey(attendanceBotKey);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </bds-paper>

            {/* Team selector */}
            {allTeams !== undefined ? (
                <div>
                    <bds-paper data-testid="teamContainer">
                        <div className="pa4 mt4">
                            <div className="pb4 mb4 bb bw1 bp-bc-neutral-medium-wave">
                                <bds-typo
                                    style={{ color: '#3A4A65' }}
                                    margin={0}
                                    variant="fs-24"
                                    bold="bold"
                                >
                                    Selecione a equipe
                                </bds-typo>

                                <bds-typo
                                    style={{ color: '#3A4A65' }}
                                    variant="fs-15"
                                >
                                    Obs.: Só apareceram as equipes que tiverem
                                    pelo menos um atendente atrelado.
                                </bds-typo>
                            </div>
                            {allTeams !== null ? (
                                <SelectTeam
                                    parentCallback={callback}
                                    allTeams={allTeams}
                                />
                            ) : (
                                <div className="w-25">
                                    <bds-select value="Todos">
                                        <bds-select-option
                                            value="Todos"
                                            onClick={() => callback('Todos')}
                                        >
                                            Todas as equipes
                                        </bds-select-option>
                                    </bds-select>
                                </div>
                            )}
                        </div>
                    </bds-paper>
                </div>
            ) : (
                ''
            )}

            {/* Scheduler options */}
            <div>
                {currentResources !== null && currentWorkTime !== null ? (
                    <Scheduler
                        currentResources={currentResources}
                        currentWorkTime={currentWorkTime}
                        currentTeam={currentTeam}
                        data-testid="schedulerContainer"
                    />
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default RouterScheduler;
