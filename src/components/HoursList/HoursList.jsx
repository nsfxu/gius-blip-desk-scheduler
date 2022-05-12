import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Input from '../Input';
import Button from '../Button';

const HoursList = ({
    workTimes,
    index,
    changeStart,
    changeEnd,
    removeWorkTime,
    addWorkTime
}) => {
    const { t } = useTranslation();

    return (
        <div className="center w-40 mt4 mb3">
            {workTimes.map((element, indexHour) => (
                <div key={index}>
                    <div className="mb3">
                        <Input
                            name="start"
                            type="time"
                            label={t('labels.start')}
                            maxLength={5}
                            placeholder="HH:MM"
                            value={element.start}
                            dataTestId={`ipt-change-start-work-time-${index}-${indexHour}`}
                            onChange={(event) => {
                                changeStart(index, indexHour, event);
                            }}
                        />
                    </div>
                    <div className="mb3">
                        <Input
                            name="start"
                            type="time"
                            label={t('labels.end')}
                            placeholder="HH:MM"
                            value={element.end}
                            onChange={(event) => {
                                changeEnd(index, indexHour, event);
                            }}
                        />
                    </div>
                    <div className="mb2">
                        <Button
                            text=""
                            icon="trash"
                            variant="ghost"
                            arrow={false}
                            disabled={false}
                            dataTestId={`btn-remove-work-time-${index}-${indexHour}`}
                            onClick={() => {
                                removeWorkTime(index, indexHour);
                            }}
                        />
                    </div>
                </div>
            ))}
            <br />
            <div className="w1 mb4 w-100 flex justify-center">
                <Button
                    text={t('labels.new')}
                    icon="add"
                    variant="primary"
                    size="standard"
                    arrow={false}
                    disabled={false}
                    dataTestId={`btn-add-work-time-${index}`}
                    onClick={() => {
                        addWorkTime(index);
                    }}
                />
            </div>
        </div>
    );
};

HoursList.propTypes = {
    workTimes: PropTypes.array,
    index: PropTypes.number,
    changeStart: PropTypes.func,
    changeEnd: PropTypes.func,
    removeWorkTime: PropTypes.func,
    addWorkTime: PropTypes.func
};

export default HoursList;
