import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BdsPaper, BdsTypo } from 'blip-ds/dist/blip-ds-react';

// eslint-disable-next-line import/named
import Header from './components/Header';
import DayOff from './components/DaysOff';
import ListWeek from './components/ListWeek';
import Button from '../../components/Button';

import SelectTeam from './components/SelectTeam/SelectTeam';
import settings from '../../config';

import {
    getResourceAsync,
    saveResourceAsync
} from '../../services/resources-service';
import { DEFAULT_TIME } from './constants';
import { buildSchedulerMessage } from './buildSchedulerMessage';
import ToastTypes from '../../constants/toast-type';

import { getAllTeamsAsync } from '../../services/teams-service';
import { showToast, withLoadingAsync } from '../../services/common-service';
import { getApplicationDataAsync } from '../../services/application-service';
import { track } from '../../services/analytics-service';
import { EXTENSION_TRACKS } from '../../constants/trackings';

const BLANK = '_blank';

const Home = () => {
    const STRONG_DAY_FORMAT_DEFAULT = false;

    const [allTeams, setAllTeams] = useState(null);
    const [times, setTimes] = useState(null);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [currentWorkTime, setCurrentWorkTime] = useState(null);

    const [application, setApplication] = useState({ shortName: 'init' });
    const { t } = useTranslation();

    const styles = {
        weekContainer: {
            display: 'flex',
            justifyContent: 'space-around'
        }
    };

    useEffect(() => {
        withLoadingAsync(async () => {
            setApplication(await getApplicationDataAsync());
            track(EXTENSION_TRACKS.open, {
                botId: application.name
            });

            // Get All Teams if is not already done
            if (allTeams == null) {
                try {
                    setAllTeams(await getAllTeamsAsync());
                    if (allTeams != null) {
                        setFirstTeam(currentTeam);
                    }
                } catch (error) {
                    return {};
                }
            }

            // Get work schedule resources of a team
            if (currentWorkTime != null) {
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
    }, [application.shortName, currentWorkTime]);

    const callback = (newTeam) => {
        setCurrentTeam(newTeam);
        setCurrentWorkTime(getNameOfWorkTime(newTeam));
    };

    const setFirstTeam = (response) => {
        if (response.total > 0) {
            const TEAM_NAME = response.items[0].name;

            setCurrentTeam(TEAM_NAME);
            setCurrentWorkTime(getNameOfWorkTime(TEAM_NAME));
            return;
        }

        setCurrentTeam('Default');
        setCurrentWorkTime(getNameOfWorkTime('Default'));
    };

    const getNameOfWorkTime = (team) => {
        if (team === 'Default') {
            return 'workTime';
        }

        return `workTime-${team}`;
    };

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

        if (response != {}) {
            showToast(
                ToastTypes.SUCCESS,
                'Sucesso',
                `Fila ${currentTeam} salva com sucesso!`
            );
        }
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

    return (
        <>
            <div className="ph1 ph4-m ph5-ns pb5">
                <Header
                    title="Giu's Blip desk scheduler"
                    onClick={() => window.open(settings.repositoryUrl, BLANK)}
                />

                <BdsPaper className="pa4 mt4">
                    <BdsTypo
                        style={{ color: '#3A4A65' }}
                        margin={0}
                        variant="fs-24"
                        bold="bold"
                    >
                        Dias e horários com atendimento
                    </BdsTypo>

                    <div className="mt2">
                        <BdsTypo style={{ color: '#3A4A65' }} variant="fs-15">
                            Preencha os horários de atendimento conforme os dias
                            da semana. Obs.: Você pode adicionar mais de um
                            intervalo de horário por dia.
                        </BdsTypo>
                    </div>
                </BdsPaper>

                <BdsPaper className="pa4 mt4">
                    <BdsTypo
                        style={{ color: '#3A4A65' }}
                        margin={5}
                        variant="fs-24"
                        bold="bold"
                    >
                        Selecione a equipe
                    </BdsTypo>
                    <SelectTeam parentCallback={callback} allTeams={allTeams} />
                </BdsPaper>

                <BdsPaper className="pa4 mt4">
                    <BdsTypo
                        style={{ color: '#3A4A65' }}
                        margin={0}
                        variant="fs-24"
                        bold="bold"
                    >
                        Horários de {currentTeam}
                        {times != null ? (
                            <div>
                                <div style={styles.weekContainer}>
                                    <ListWeek
                                        times={times}
                                        changeStart={changeStart}
                                        changeEnd={changeEnd}
                                        removeWorkTime={removeWorkTime}
                                        addWorkTime={addWorkTime}
                                    />
                                </div>
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
                        ) : (
                            <h2>{t('loading')}</h2>
                        )}
                    </BdsTypo>
                </BdsPaper>
            </div>
        </>
    );
};

export default Home;
