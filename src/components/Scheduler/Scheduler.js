/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import propTypes from 'prop-types';
import ToastTypes from '../../constants/toast-type';

import { showToast, withLoadingAsync } from '../../services/common-service';
import { saveResourceAsync } from '../../services/resources-service';

import { track } from '../../services/analytics-service';
import { EXTENSION_TRACKS } from '../../constants/trackings';

import { DEFAULT_TIME } from '../../constants/defaultTime';
import { buildSchedulerMessage } from '../../utils/buildSchedulerMessage';

import DayOff from '../DaysOff';
import ListWeek from '../ListWeek';
import Button from '../Button';

const Scheduler = ({ currentResources, currentWorkTime, currentTeam }) => {
    const STRONG_DAY_FORMAT_DEFAULT = false;

    const [times, setTimes] = useState(null);

    const { t } = useTranslation();
    const styles = {
        weekContainer: {
            display: 'flex',
            width: '100%',
            justifyContent: 'space-around'
        }
    };

    // Apply currentResources and handle the changes
    useEffect(() => {
        withLoadingAsync(async () => {
            try {
                if (currentResources.weekdays && currentResources.noWorkDays) {
                    await setTimes(null);
                    handleChangeTimes(currentResources);
                } else {
                    handleChangeTimes(DEFAULT_TIME);
                }
            } catch (error) {
                return {};
            }
        });
    }, [currentResources]);

    // #region Scheduler Functions

    const handleChangeTimes = (val) => {
        const schedulerMessage = buildSchedulerMessage(
            val,
            STRONG_DAY_FORMAT_DEFAULT
        );

        setTimes({
            ...val,
            schedulerMessage
        });
    };

    const saveAsync = async () => {
        const response = await saveResourceAsync(currentWorkTime, times);

        track(EXTENSION_TRACKS.save, {
            time: times
        });

        if (response !== {}) {
            showToast(
                ToastTypes.SUCCESS,
                'Sucesso',
                `Horário de atendimento salvo com sucesso!`
            );
        }
    };

    const removeDayOff = async (index) => {
        const newVal = { ...times };
        newVal.noWorkDays.splice(index, 1);
        await handleChangeTimes(newVal);
    };

    const removeWorkTime = (indexWeek, indexHour) => {
        const newVal = { ...times };
        newVal.weekdays[indexWeek].workTimes.splice(indexHour, 1);
        handleChangeTimes(newVal);
    };

    const changeStart = (indexWeek, indexHour, event) => {
        const newVal = { ...times };
        const weekdays = newVal.weekdays[indexWeek];
        const workTime = weekdays.workTimes.find(
            (_item, index) => index === indexHour
        );
        if (workTime) {
            workTime.start = event.target.value;
        }
        handleChangeTimes(newVal);
    };

    const changeEnd = (indexWeek, indexHour, event) => {
        const newVal = { ...times };
        const weekdays = newVal.weekdays[indexWeek];
        const workTime = weekdays.workTimes.find(
            (_item, index) => index === indexHour
        );
        if (workTime) {
            workTime.end = event.target.value;
        }
        handleChangeTimes(newVal);
    };

    const changeDayOff = (index, event) => {
        const newVal = { ...times };
        newVal.noWorkDays[index] = event.target.value;
        setTimes(newVal);
    };

    const addWorkTime = (index) => {
        const newItem = {
            start: '09:00',
            end: '19:00'
        };

        const newVal = { ...times };
        if (newVal.weekdays[index].workTimes) {
            newVal.weekdays[index].workTimes.push(newItem);
        } else {
            newVal.weekdays[index].workTimes = [newItem];
        }
        handleChangeTimes(newVal);
    };

    const addDayOff = () => {
        const newItem = 'MM-DD';
        const newVal = { ...times };
        newVal.noWorkDays.push(newItem);
        setTimes(newVal);
    };

    // #endregion

    if (times !== null) {
        return (
            <>
                {/* Weeks container */}
                <bds-paper data-testid="weeksContainer">
                    <div className="mt4 pa4">
                        <div className="pb4 mb4 bb bw1 bp-bc-neutral-medium-wave">
                            <bds-typo
                                style={{ color: '#3A4A65' }}
                                margin={0}
                                variant="fs-24"
                                bold="bold"
                            >
                                Horários de atendimento - {currentTeam}
                            </bds-typo>

                            <bds-typo
                                style={{ color: '#3A4A65' }}
                                variant="fs-15"
                            >
                                Preencha os horários de atendimento conforme os
                                dias da semana. Obs.: Você pode adicionar mais
                                de um intervalo de horário por dia.
                            </bds-typo>
                        </div>
                        <div style={styles.weekContainer}>
                            <ListWeek
                                times={times}
                                changeStart={changeStart}
                                changeEnd={changeEnd}
                                removeWorkTime={removeWorkTime}
                                addWorkTime={addWorkTime}
                            />
                        </div>
                    </div>
                </bds-paper>

                {/* No work days container */}
                <bds-paper data-testid="noWorkDaysContainer">
                    <div className="pa4 mt4">
                        <div className="pb4 mb4 bb bw1 bp-bc-neutral-medium-wave">
                            <bds-typo
                                style={{ color: '#3A4A65' }}
                                margin={0}
                                variant="fs-24"
                                bold="bold"
                            >
                                Dias sem atendimento - {currentTeam}
                            </bds-typo>

                            <bds-typo
                                style={{ color: '#3A4A65' }}
                                variant="fs-15"
                            >
                                Preencha abaixo os dias que não haverão
                                atendimento.
                            </bds-typo>
                        </div>
                        <div className="pb3">
                            <DayOff
                                noWorkDays={times.noWorkDays}
                                changeDayOff={changeDayOff}
                                removeDayOff={removeDayOff}
                                addDayOff={addDayOff}
                            />
                        </div>
                        <div className="w1">
                            <Button
                                text={t('labels.save')}
                                icon="save-disk"
                                variant="primary"
                                arrow={false}
                                disabled={false}
                                onClick={saveAsync}
                            />
                        </div>
                    </div>
                </bds-paper>
            </>
        );
    }

    return <h2>{t('loading')}</h2>;
};

Scheduler.propTypes = {
    currentResources: propTypes.any,
    currentWorkTime: propTypes.any,
    currentTeam: propTypes.string
};

export default Scheduler;
