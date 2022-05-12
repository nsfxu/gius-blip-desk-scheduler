import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
    variant,
    size,
    icon,
    text,
    arrow,
    disabled,
    children,
    ariaLabel = 'bds-button',
    dataTestId = 'bds-button',
    onClick = () => {}
}) => (
    <bds-button
        data-testid={dataTestId}
        aria-label={ariaLabel}
        icon={icon}
        variant={variant}
        size={size}
        arrow={arrow}
        disabled={disabled}
        onClick={onClick}
    >
        {!!text ? text : children}
    </bds-button>
);

Button.propTypes = {
    variant: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.string,
    text: PropTypes.string,
    arrow: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.any,
    ariaLabel: PropTypes.string,
    dataTestId: PropTypes.string,
    onClick: PropTypes.func
};

export default Button;
