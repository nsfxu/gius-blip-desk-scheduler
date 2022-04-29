/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BdsPaper, BdsTypo } from 'blip-ds/dist/blip-ds-react';
import Header from '../../components/Header';
import SelectTeam from '../../components/SelectTeam/SelectTeam';

import ToastTypes from '../../constants/toast-type';
import settings from '../../config';
import { getApplicationDataAsync } from '../../services/application-service';
import {
    getResourceAsync,
    saveResourceAsync
} from '../../services/resources-service';
import { track } from '../../services/analytics-service';
import { EXTENSION_TRACKS } from '../../constants/trackings';
import { showToast, withLoadingAsync } from '../../services/common-service';
import Input from '../../components/Input';
import Button from '../../components/Button';

const BLANK = '_blank';
const RESOURCE_NAME = 'botAttendanceKey';

const RouterScheduler = () => {
    // console.log('Router 🤖');
    const { t } = useTranslation();

    const [application, setApplication] = useState({ shortName: 'init' });
    const [attendanceBotKey, setAttendanceBotkey] = useState(null);

    const [canSelectTeams, setCanSelectTeams] = useState(false);

    const [allTeams, setAllTeams] = useState(null);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [currentWorkTime, setCurrentWorkTime] = useState(null);

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
                        setCanSelectTeams(true);
                    } else {
                        setAttendanceBotkey('');
                    }
                } catch (error) {
                    return {};
                }
            }
        });
    });

    // save a new key into resources
    const saveNewKey = async () => {
        // check if the key is valid
        if (!attendanceBotKey.startsWith('Key ')) {
            showToast(ToastTypes.DANGER, 'Error', `Chave inválida`);
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

        setCanSelectTeams(true);

        if (response !== {}) {
            showToast(
                ToastTypes.SUCCESS,
                'Sucesso',
                `Chave do bot alterada com sucesso`
            );
        }
    };

    //
    useEffect(() => {}, [canSelectTeams]);

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
                    <div className="mb4">
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

                <div>
                    {canSelectTeams === true ? (
                        // Team selection container
                        <BdsPaper className="pa4 mt4">
                            <BdsTypo
                                style={{ color: '#3A4A65' }}
                                margin={5}
                                variant="fs-24"
                                bold="bold"
                            >
                                Selecione a equipe
                            </BdsTypo>
                            <SelectTeam
                                parentCallback={callback}
                                allTeams={allTeams}
                            />
                        </BdsPaper>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </>
    );
};

export default RouterScheduler;
