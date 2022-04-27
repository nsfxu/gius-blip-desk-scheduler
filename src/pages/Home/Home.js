import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { withLoadingAsync } from '../../services/common-service';
import { getApplicationDataAsync } from '../../services/application-service';
import { track } from '../../services/analytics-service';
import { EXTENSION_TRACKS } from '../../constants/trackings';

const ROUTER_TEMPLATE = 'master';

const Home = () => {
    const { t } = useTranslation();

    const [application, setApplication] = useState({ shortName: 'init' });
    const history = useHistory();

    // Return current bot data
    useEffect(() => {
        withLoadingAsync(async () => {
            setApplication(await getApplicationDataAsync());
            track(EXTENSION_TRACKS.open, {
                botId: application.name
            });
        });
    }, [application.shortName]);

    // Check what type of template the extension is in it
    // Types: Router
    //        Builder
    useEffect(() => {
        if (!!application && application?.shortName !== 'init') {
            // if the extension is installed into a router, we redirected the user to the RouterScheduler page
            // if not, we send the user to the BuilderScheduler page
            if (isRouter()) {
                history.push('/router');
            } else {
                history.push('/builder');
            }
        }
    }, [application]);

    const isRouter = () => {
        return application?.template === ROUTER_TEMPLATE;
    };

    return <h1>{t('loading')}</h1>;
};

export default Home;
