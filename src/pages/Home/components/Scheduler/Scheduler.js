import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import propTypes from 'prop-types';
import { withLoadingAsync } from '../../../../services/common-service';
import { getApplicationDataAsync } from '../../../../services/application-service';
import { track } from '../../../../services/analytics-service';
import { EXTENSION_TRACKS } from '../../../../constants/trackings';
import {
    getResourceAsync,
    saveResourceAsync
} from '../../../../services/resources-service';
import { DEFAULT_TIME } from '../../constants';
import { buildSchedulerMessage } from '../../buildSchedulerMessage';

import DayOff from '../DaysOff';
import ListWeek from '../ListWeek';
import Button from '../../../../components/Button';

const Scheduler = ({ currentWorkTime }) => {
    // const currentWorkTime = currentWorkTime;
    const STRONG_DAY_FORMAT_DEFAULT = false;

    const [times, setTimes] = useState(null);
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
            try {
                const resourceTimes = await getResourceAsync(currentWorkTime);

                if (resourceTimes.weekdays && resourceTimes.noWorkDays) {
                    console.log(resourceTimes);
                    handleChangeTimes(resourceTimes);
                } else {
                    handleChangeTimes(DEFAULT_TIME);
                }
            } catch (error) {
                console.log(error);
            }
        });
    }, [currentWorkTime]);


    if (times != null) {
        return (
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
                <h2>Dias sem trabalhos {currentWorkTime}</h2>
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
