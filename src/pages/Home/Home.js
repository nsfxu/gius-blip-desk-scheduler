import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { withLoadingAsync } from '../../services/common-service';
import { getApplicationDataAsync } from '../../services/application-service';
import { track } from '../../services/analytics-service';
import { EXTENSION_TRACKS } from '../../constants/trackings';

const ROUTER_TEMPLATE = 'master';

const Home = () => {
    const [application, setApplication] = useState({ shortName: 'init' });
    const { t } = useTranslation();

    // Return current bot data
    useEffect(() => {
        withLoadingAsync(async () => {
            setApplication(await getApplicationDataAsync());
            track(EXTENSION_TRACKS.open, {
                botId: application.name
            });
            console.log(application);
        });
    }, [application.shortName]);

    // Check what type of template the extension is in it
    // Types: Router
    //        Builder
    useEffect(() => {
        if (!!application && application?.shortName !== 'init') {
            if (isRouter()) {
                console.log('Router 🤖');
            } else {
                console.log('Builder 👷‍');
            }
        }
    });

    const isRouter = () => {
        return application?.template === ROUTER_TEMPLATE;
    };

    return (
        <div className="ph1 ph4-m ph5-ns pb5">
            <h1>{t('loading')}</h1>
        </div>
    );
};

export default Home;
