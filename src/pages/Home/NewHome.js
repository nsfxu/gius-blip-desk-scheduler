import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/named

import { BdsPaper, BdsTypo } from 'blip-ds/dist/blip-ds-react';
import Header from './components/Header';
import SelectTeam from './components/SelectTeam/SelectTeam';
import Scheduler from './components/Scheduler/Scheduler';

import settings from '../../config';
import {
    getAllowedSubbotsAsync,
    getApplicationDataAsync
} from '../../services/application-service';
import { getAllTeamsAsync } from '../../services/teams-service';
import { withLoadingAsync } from '../../services/common-service';
import { track } from '../../services/analytics-service';
import { EXTENSION_TRACKS } from '../../constants/trackings';

const BLANK = '_blank';
const ROUTER_TEMPLATE = 'master';

const Home = () => {
    const STRONG_DAY_FORMAT_DEFAULT = false;

    const [allTeams, setAllTeams] = useState(null);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [currentWorkTime, setCurrentWorkTime] = useState(null);

    const [application, setApplication] = useState({ shortName: 'init' });
    const { t } = useTranslation();

    useEffect(() => {
        withLoadingAsync(async () => {
            setApplication(await getApplicationDataAsync());
            track(EXTENSION_TRACKS.open, {
                botId: application.name
            });

            // Get All Teams if is not already done
            if (allTeams == null) {
                try {
                    setAllTeams(await getAllTeamsAsync());
                    if (allTeams != null) {
                        setFirstTeam(currentTeam);
                    }
                } catch (error) {
                    return {};
                }
            }
        });
    }, [application.shortName, currentWorkTime]);

    useEffect(() => {
        if (!!application && application?.shortName) {
            if (isRouter()) {
                getBotsInfo();
            }
        }
    }, [application]);

    const getBotsInfo = async () => {
        await withLoadingAsync(async () => {
            const botData = await getAllowedSubbotsAsync(application);
            console.log(botData);
        });
    };

    const isRouter = () => {
        return application?.template === ROUTER_TEMPLATE;
    };

    const callback = (newTeam) => {
        setCurrentTeam(newTeam);
        setCurrentWorkTime(getNameOfWorkTime(newTeam));
    };

    const setFirstTeam = (response) => {
        if (response.total > 0) {
            const TEAM_NAME = response.items[0].name;

            setCurrentTeam(TEAM_NAME);
            setCurrentWorkTime(getNameOfWorkTime(TEAM_NAME));
            return;
        }

        setCurrentTeam('Default');
        setCurrentWorkTime(getNameOfWorkTime('Default'));
    };

    const getNameOfWorkTime = (team) => {
        if (team === 'Default') {
            return 'workTime';
        }

        return `workTime-${team}`;
    };

    return (
        <>
            <div className="ph1 ph4-m ph5-ns pb5">
                <Header
                    title="Giu's Blip desk scheduler"
                    onClick={() => window.open(settings.repositoryUrl, BLANK)}
                />

                <BdsPaper className="pa4 mt4">
                    <BdsTypo
                        style={{ color: '#3A4A65' }}
                        margin={5}
                        variant="fs-24"
                        bold="bold"
                    >
                        Selecione a equipe
                    </BdsTypo>
                    <SelectTeam parentCallback={callback} allTeams={allTeams} />
                </BdsPaper>

                <BdsPaper className="pa4 mt4">
                    {currentWorkTime != null ? (
                        <Scheduler currentWorkTime={currentWorkTime} />
                    ) : (
                        <p>{t('loading')}</p>
                    )}
                </BdsPaper>
            </div>
        </>
    );
};

export default Home;
