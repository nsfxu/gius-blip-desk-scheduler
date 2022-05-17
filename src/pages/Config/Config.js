import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ToastTypes from '../../constants/toast-type';

import Header from '../../components/Header';
import Input from '../../components/Input';
import Button from '../../components/Button';

import {
    getResourceAsync,
    saveResourceAsync
} from '../../services/resources-service';
import { getApplicationDataAsync } from '../../services/application-service';
import { showToast, withLoadingAsync } from '../../services/common-service';

import { track } from '../../services/analytics-service';
import { EXTENSION_TRACKS } from '../../constants/trackings';

import { TIMEZONES } from '../../constants/timezones';

const ROUTER_TEMPLATE = 'master';

const Config = () => {
    const { t } = useTranslation();

    const [application, setApplication] = useState({ shortName: 'init' });
    const [attendanceBotKey, setAttendanceBotkey] = useState(null);
    const [offset, setOffset] = useState(null);

    const [disableGMT, setDisableGMT] = useState(true);
    const [disableBotKey, setDisableBotKey] = useState(true);

    // Return current bot data
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
                        'botAttendanceKey'
                    );

                    if (resourceAttendanceBotKey.key) {
                        setAttendanceBotkey(resourceAttendanceBotKey.key);
                    } else {
                        setAttendanceBotkey(null);
                    }
                } catch (error) {
                    return {};
                }
            }
        });
    });

    // check if exists an offset on resources
    useEffect(() => {
        withLoadingAsync(async () => {
            if (offset === null) {
                const offsetValue = await getResourceAsync('offset');

                if (offsetValue.name === 'Error') {
                    saveNewOffset(-3);
                    setOffset(-3);
                    return;
                }

                setOffset(offsetValue);
            }
        });
    });

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
                'botAttendanceKey',
                attendanceBotKeyResource,
                'application/json'
            );

            if (response !== {}) {
                showToast(
                    ToastTypes.SUCCESS,
                    'Sucesso',
                    `Chave do bot alterada com sucesso.`
                );
            }
        });
    };

    // save a new offset into resources
    const saveNewOffset = async (offset) => {
        withLoadingAsync(async () => {
            const response = await saveResourceAsync(
                'offset',
                offset,
                'text/plain'
            );

            if (response !== {}) {
                showToast(
                    ToastTypes.SUCCESS,
                    'Sucesso',
                    `Fuso horário alterado com sucesso.`
                );
            }
        });
    };

    const isRouter = () => {
        return application?.template === ROUTER_TEMPLATE;
    };

    return (
        <div className="ph1 ph4-m ph5-ns pb5 w-100">
            <Header
                title="Blip desk scheduler"
                onClick={() => window.open(settings.repositoryUrl, BLANK)}
            />

            {attendanceBotKey === '' || attendanceBotKey === null && isRouter() ? (
                <div className="mt4">
                    <bds-banner variant="error">
                        Por favor, insira a chave do seu bot de atendimento
                        humano abaixo.
                    </bds-banner>
                </div>
            ) : (
                ''
            )}

            {/* botKey input */}
            {isRouter() === true ? (
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
                            <bds-typo
                                style={{ color: '#3A4A65' }}
                                variant="fs-15"
                            >
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
                                    disabled={disableBotKey}
                                    onChange={(e) => {
                                        setAttendanceBotkey(e.target.value);
                                    }}
                                />
                            </div>
                            <div
                                className="pr3 flex justify-center"
                                hidden={disableBotKey}
                            >
                                <div className="pr3" hidden={disableBotKey}>
                                    <Button
                                        variant="ghost"
                                        icon="save-disk"
                                        arrow={false}
                                        disabled={disableBotKey}
                                        onClick={() => {
                                            saveNewKey(offset);
                                            setDisableBotKey(!disableBotKey);
                                        }}
                                    />
                                </div>
                                <div hidden={disableBotKey}>
                                    <Button
                                        icon="close"
                                        variant="ghost"
                                        arrow={false}
                                        disabled={disableBotKey}
                                        onClick={() => {
                                            setDisableBotKey(!disableBotKey);
                                        }}
                                    />
                                </div>
                            </div>
                            <div hidden={!disableBotKey}>
                                <Button
                                    text={t('labels.edit')}
                                    icon="edit"
                                    variant="ghost"
                                    arrow={false}
                                    disabled={false}
                                    onClick={() => {
                                        setDisableBotKey(!disableBotKey);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </bds-paper>
            ) : (
                ''
            )}

            {/* GMT selector */}
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
                            Fuso horário
                        </bds-typo>
                        <bds-typo style={{ color: '#3A4A65' }} variant="fs-15">
                            Altere o seu fuso horário abaixo clicando no botão
                            de editar.
                        </bds-typo>
                    </div>

                    {/* Inserting attendance bot key */}
                    <div className="flex">
                        <div className="mr3 w-60">
                            <bds-select
                                value={offset}
                                icon="clock"
                                disabled={disableGMT}
                            >
                                {TIMEZONES.map((e, index) => (
                                    <bds-select-option
                                        key={index}
                                        value={e.value}
                                        onClick={() => {
                                            setOffset(e.value);
                                        }}
                                    >
                                        {e.label}
                                    </bds-select-option>
                                ))}
                            </bds-select>
                        </div>
                        <div
                            className="pr3 flex justify-center"
                            hidden={disableGMT}
                        >
                            <div className="pr3" hidden={disableGMT}>
                                <Button
                                    variant="ghost"
                                    icon="save-disk"
                                    arrow={false}
                                    disabled={disableGMT}
                                    onClick={() => {
                                        saveNewOffset(offset);
                                        setDisableGMT(!disableGMT);
                                    }}
                                />
                            </div>
                            <div hidden={disableGMT}>
                                <Button
                                    icon="close"
                                    variant="ghost"
                                    arrow={false}
                                    disabled={disableGMT}
                                    onClick={() => {
                                        setDisableGMT(!disableGMT);
                                    }}
                                />
                            </div>
                        </div>
                        <div hidden={!disableGMT}>
                            <Button
                                text={t('labels.edit')}
                                icon="edit"
                                variant="ghost"
                                arrow={false}
                                disabled={false}
                                onClick={() => {
                                    setDisableGMT(!disableGMT);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </bds-paper>
        </div>
    );
};

export default Config;
