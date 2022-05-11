import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '../Button';
import PageHeader from '../PageHeader';

const Header = ({ title, icon, onClick = () => {} }) => {
    const { t } = useTranslation();

    const renderOptions = () => (
        <div className="ml3">
            <Button
                text={t('button.repository')}
                variant="primary"
                onClick={() => onClick()}
                dataTestId="repository-link"
            />
        </div>
    );

    return (
        <PageHeader
            title={title}
            icon={icon}
            relatedOptions={renderOptions()}
        />
    );
};

Header.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    onSearch: PropTypes.func,
    onClick: PropTypes.func
};

export default Header;
