import React from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '../Button';
import Input from '../Input';

const DayOff = ({
    noWorkDays,
    changeDayOff = () => {},
    removeDayOff,
    addDayOff
}) => {
    const { t } = useTranslation();

    const styles = {
        daysOffGroup: {
            display: 'flex',
            justifyContent: 'start'
        }
    };

    return (
        <div data-testid="day-off">
            {noWorkDays.map((element, index) => (
                <div key={index} style={styles.daysOffGroup} className="pb1">
                    <Input
                        type="text"
                        name="start"
                        placeholder="MM-DD"
                        icon="calendar"
                        maxLength={5}
                        value={element}
                        onChange={(event) => {
                            changeDayOff(index, event);
                        }}
                        dataTestId={`ipt-data-${index}`}
                    />
                    <div className="w1">
                        <Button
                            text=""
                            icon="trash"
                            variant="ghost"
                            arrow={false}
                            onClick={() => {
                                removeDayOff(index);
                            }}
                            dataTestId={`btn-remove-${index}`}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

DayOff.propTypes = {
    noWorkDays: PropTypes.array,
    changeDayOff: PropTypes.func,
    removeDayOff: PropTypes.func,
    addDayOff: PropTypes.func
};

export default DayOff;
