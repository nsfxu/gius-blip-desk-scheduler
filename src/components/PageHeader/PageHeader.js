import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Proptypes from 'prop-types';
import ToastTypes from '../../constants/toast-type';

import { showToast, withLoadingAsync } from '../../services/common-service';
import {
    getResourceAsync,
    saveResourceAsync
} from '../../services/resources-service';

import Button from '../Button';
import { TIMEZONES } from '../../constants/timezones';

const COLOR_NEUTRAL_DARK_ROOFTOP = '#505F79';
const COLOR_NEUTRAL_MEDIUM_CLOUD = '#8CA0B3';

const PageHeader = ({
    title,
    icon,
    isInformative = false,
    helpText,
    isBackNavigation = false,
    onBackPressed,
    relatedOptions
}) => {
    const [offset, setOffset] = useState(null);
    const { t } = useTranslation();

    // check if exists offset key on resources
    useEffect(() => {
        withLoadingAsync(async () => {
            if (offset === null) {
                try {
                    const offsetValue = await getResourceAsync('offset');

                    if (offsetValue.name === 'Error') {
                        setOffset(-3);
                        return;
                    }

                    setOffset(offsetValue);
                } catch (error) {
                    return {};
                }
            }
        });
    });

    const saveOffset = async (value) => {
        withLoadingAsync(async () => {
            const response = await saveResourceAsync(
                'offset',
                value,
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
    }

    return (
        <div className="flex flex-row items-center-ns justify-between w-100 pv3 mt2 bb bp-bc-neutral-medium-wave">
            <div className="flex items-center w-100 ">
                {isBackNavigation && (
                    <div
                        className="pointer mr1"
                        onClick={onBackPressed}
                        data-testid="page-header-back-icon"
                    >
                        <bds-icon
                            name="arrow-left"
                            color={COLOR_NEUTRAL_DARK_ROOFTOP}
                        />
                    </div>
                )}

                {!!icon && (
                    <div data-testid="page-header-icon">
                        <bds-icon
                            name={icon}
                            color={COLOR_NEUTRAL_DARK_ROOFTOP}
                        />
                    </div>
                )}

                <div className="w-20 ml2 mr1">
                    <h2 className="f3 bp-c-neutral-dark-city">{title}</h2>
                </div>

                <div className="w-60 flex justify-center">
                    <div className="mr3">
                        <bds-select value={offset} icon="clock">
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
                    <div>
                        <Button
                            text={t('labels.save')}
                            icon="save-disk"
                            variant="primary"
                            arrow={false}
                            disabled={false}
                            onClick={() => {
                                saveOffset(offset);
                            }}
                        />
                    </div>
                </div>
            </div>
            {!!relatedOptions && (
                <div className="flex items-center justify-end">
                    {relatedOptions}
                </div>
            )}
        </div>
    );
};

PageHeader.propTypes = {
    title: Proptypes.string,
    icon: Proptypes.string,
    isInformative: Proptypes.bool,
    helpText: Proptypes.string,
    isBackNavigation: Proptypes.bool,
    onBackPressed: Proptypes.func,
    relatedOptions: Proptypes.any
};

export default PageHeader;
