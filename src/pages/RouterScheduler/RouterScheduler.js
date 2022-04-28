import React, { useEffect, useState } from 'react';

import { BdsPaper, BdsTypo } from 'blip-ds/dist/blip-ds-react';
import SelectBot from '../../components/SelectBot';
import Header from '../../components/Header';

import settings from '../../config';
import {
    getAllowedSubbotsAsync,
    getApplicationDataAsync,
    getBotDataAsync
} from '../../services/application-service';
import { track } from '../../services/analytics-service';
import { EXTENSION_TRACKS } from '../../constants/trackings';
import { withLoadingAsync } from '../../services/common-service';

const BLANK = '_blank';

const RouterScheduler = () => {
    // console.log('Router 🤖');

    const [application, setApplication] = useState({ shortName: 'init' });
    const [subBots, setSubBots] = useState(null);
    const [currentBot, setCurrentBot] = useState(null);

    // Return current router data
    // And get all sub bots from router
    useEffect(() => {
        withLoadingAsync(async () => {
            setApplication(await getApplicationDataAsync());
            console.log(
                await getBotDataAsync('atendimentohumano556@msging.net')
            );
            if (application.shortName !== 'init') {
                setSubBots(await getAllowedSubbotsAsync(application));
            }
            track(EXTENSION_TRACKS.open, {
                botId: application.name
            });
        });
    }, [application.shortName]);

    const getNewBot = (newBot) => {
        // console.log(newBot);
        setCurrentBot(newBot);
    };

    return (
        <>
            <div className="ph1 ph4-m ph5-ns pb5">
                <Header
                    title="Blip desk scheduler"
                    onClick={() => window.open(settings.repositoryUrl, BLANK)}
                />

                {/* Bot selector */}
                <BdsPaper className="pa4 mt4">
                    {/* Title container */}
                    <div className="mb4">
                        <BdsTypo
                            style={{ color: '#3A4A65' }}
                            margin={5}
                            variant="fs-24"
                            bold="bold"
                        >
                            Bot de Atendimento Humano
                        </BdsTypo>
                        <BdsTypo style={{ color: '#3A4A65' }} variant="fs-15">
                            Selecione o bot que você usa para atendimento
                            humano.
                        </BdsTypo>
                    </div>

                    {/* Bot selector */}
                    <SelectBot parentCallback={getNewBot} subBots={subBots} />
                </BdsPaper>
            </div>
        </>
    );
};

export default RouterScheduler;
