/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BdsPaper, BdsTypo } from 'blip-ds/dist/blip-ds-react';
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

    const [allTeams, setAllTeams] = useState(null);
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
                        setAttendanceBotkey('');
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
                hideTeamsSelector();
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
                attendanceBotKeyResource
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

    // request via HTTP #get-all-teams with the current attendanceBotKey
    const RequestAllTeams = async (botKey) => {
        if (botKey !== null) {
            try {
                const response = await getAllTeams(botKey);

                // send a error messsage
                // causes: The authorization key is invalid
                if (response === false) {
                    // hide team selector component

                    showToast(
                        ToastTypes.DANGER,
                        'Erro',
                        `Não foi possível buscar as equipes com a chave inserida.`
                    );
                }

                if (response.data.resource) {
                    hideTeamsSelector();
                    setAllTeams(response.data.resource);
                }
            } catch (error) {
                return error;
            }
        }
    };

    const hideTeamsSelector = () => {
        setAllTeams(null);
    };

    // #endregion

    // ==================================
    // #region team selection functions
    // ==================================

    // receive response from input selector of teams
    const callback = (newTeam) => {
        setCurrentTeam(newTeam);
        setCurrentWorkTime(getNameOfWorkTime(newTeam));
    };

    const getNameOfWorkTime = (team) => {
        if (team === 'Default') {
            return 'workTime';
        }

        return `workTime-${team}`;
    };

    // #endregion

    return (
        <>
            <div className="ph1 ph4-m ph5-ns pb5">
                <Header
                    title="Blip desk scheduler"
                    onClick={() => window.open(settings.repositoryUrl, BLANK)}
                />

                {/* Bot selector */}
                <BdsPaper className="pa4 mt4">
                    {/* Title container */}
                    <div className="pb4 mb4 bb bw1 bp-bc-neutral-medium-wave">
                        <BdsTypo
                            style={{ color: '#3A4A65' }}
                            margin={5}
                            variant="fs-24"
                            bold="bold"
                        >
                            Bot de Atendimento Humano
                        </BdsTypo>
                        <BdsTypo style={{ color: '#3A4A65' }} variant="fs-15">
                            Insira a chave do seu bot de atendimento humano
                            abaixo.
                        </BdsTypo>
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
                </BdsPaper>

                {/* Team selector */}
                <div>
                    {allTeams !== null ? (
                        // Team selection container
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

                                <bds-typo
                                    style={{ color: '#3A4A65' }}
                                    variant="fs-15"
                                >
                                    Obs.: Só apareceram as equipes que tiverem
                                    pelo menos um atendente atrelado.
                                </bds-typo>
                            </div>
                            <SelectTeam
                                parentCallback={callback}
                                allTeams={allTeams}
                            />
                        </BdsPaper>
                    ) : (
                        ''
                    )}
                </div>

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

export default RouterScheduler;
