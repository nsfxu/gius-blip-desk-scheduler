import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import propTypes from 'prop-types';
import ToastTypes from '../../../../constants/toast-type';

import {
    showToast,
    withLoadingAsync
} from '../../../../services/common-service';
import {
    getResourceAsync,
    saveResourceAsync
} from '../../../../services/resources-service';
import { track } from '../../../../services/analytics-service';
import { EXTENSION_TRACKS } from '../../../../constants/trackings';
import { DEFAULT_TIME } from '../../constants';
import { buildSchedulerMessage } from '../../buildSchedulerMessage';

import DayOff from '../DaysOff';
import ListWeek from '../ListWeek';
import Button from '../../../../components/Button';

const Scheduler = ({ currentWorkTime }) => {
    const STRONG_DAY_FORMAT_DEFAULT = false;

    const [times, setTimes] = useState(null);

    const { t } = useTranslation();
    const styles = {
        weekContainer: {
            display: 'flex',
            justifyContent: 'space-around'
        }
    };

    useEffect(() => {
        withLoadingAsync(async () => {
            // Get work schedule resources of a team
            if (currentWorkTime !== null) {
                try {
                    const resourceTimes = await getResourceAsync(
                        currentWorkTime
                    );

                    if (resourceTimes.weekdays && resourceTimes.noWorkDays) {
                        handleChangeTimes(resourceTimes);
                    } else {
                        handleChangeTimes(DEFAULT_TIME);
                    }
                } catch (error) {
                    return {};
                }
            }
        });
    }, [currentWorkTime]);

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

    const removeAnyDuplicates = (newTimes) => {
        return Array.from(new Set(newTimes.noWorkDays));
    };

    const removeDayOff = (index) => {
        const newVal = { ...times };
        newVal.noWorkDays.splice(index, 1);
        setTimes(newVal);
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
            <div>
                {/* Header */}
                <div className="pb4 mb4 bb bw1 bp-bc-neutral-medium-wave">
                    <bds-typo
                        style={{ color: '#3A4A65' }}
                        margin={0}
                        variant="fs-24"
                        bold="bold"
                    >
                        Dias e horários com atendimento
                    </bds-typo>

                    <bds-typo style={{ color: '#3A4A65' }} variant="fs-15">
                        Preencha os horários de atendimento conforme os dias da
                        semana. Obs.: Você pode adicionar mais de um intervalo
                        de horário por dia.
                    </bds-typo>
                </div>
                {/* Times Container */}
                <div style={styles.weekContainer}>
                    <ListWeek
                        times={times}
                        changeStart={changeStart}
                        changeEnd={changeEnd}
                        removeWorkTime={removeWorkTime}
                        addWorkTime={addWorkTime}
                    />
                </div>
                {/* No Work Days */}
                <h2>Dias sem trabalhos</h2>
                <DayOff
                    noWorkDays={times.noWorkDays}
                    changeDayOff={changeDayOff}
                    removeDayOff={removeDayOff}
                    addDayOff={addDayOff}
                />
                <br />
                <br />
                <Button
                    text={t('labels.save')}
                    icon="save-disk"
                    variant="primary"
                    arrow={false}
                    disabled={false}
                    onClick={saveAsync}
                />
            </div>
        );
    }

    return <h2>{t('loading')}</h2>;
};

Scheduler.propTypes = {
    currentWorkTime: propTypes.any
};

export default Scheduler;
