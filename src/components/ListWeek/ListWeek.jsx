import React from 'react';
import PropTypes from 'prop-types';
import HoursList from '../HoursList';

const ListWeek = ({
    times,
    changeStart,
    changeEnd,
    removeWorkTime,
    addWorkTime
}) => {
    return (
        <>
            <bds-tabs>
                {times.weekdays.map((element, index) => (
                    <bds-tab key={index} group={index} label={element.day} />
                ))}
            </bds-tabs>
            {times.weekdays.map((element, index) => (
                <div key={element.day}>
                    <bds-tab-panel group={index}>
                        <div className="flex justify-center mt3">
                            <bds-typo variant="f-16" bold="bold">
                                {element.day}
                            </bds-typo>
                        </div>
                        <div className="flex justify-center w-100">
                            <HoursList
                                key={index}
                                workTimes={element.workTimes}
                                index={index}
                                changeStart={changeStart}
                                changeEnd={changeEnd}
                                removeWorkTime={removeWorkTime}
                                addWorkTime={addWorkTime}
                            />
                        </div>
                    </bds-tab-panel>
                </div>
            ))}
        </>
    );
};

ListWeek.propTypes = {
    times: PropTypes.object,
    index: PropTypes.number,
    changeStart: PropTypes.func,
    changeEnd: PropTypes.func,
    removeWorkTime: PropTypes.func,
    addWorkTime: PropTypes.func
};

export default ListWeek;
