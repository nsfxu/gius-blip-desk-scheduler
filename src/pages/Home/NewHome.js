import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/named

import { BdsPaper, BdsTypo } from 'blip-ds/dist/blip-ds-react';
import Header from './components/Header';
import SelectTeam from './components/SelectTeam/SelectTeam';
import Scheduler from './components/Scheduler/Scheduler';

import settings from '../../config';
import { getAllTeamsAsync } from '../../services/teams-service';
import { withLoadingAsync } from '../../services/common-service';
import { getApplicationDataAsync } from '../../services/application-service';
import { track } from '../../services/analytics-service';
import { EXTENSION_TRACKS } from '../../constants/trackings';

const BLANK = '_blank';

const Home = () => {
    const STRONG_DAY_FORMAT_DEFAULT = false;

    const [allTeams, setAllTeams] = useState(null);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [currentWorkTime, setCurrentWorkTime] = useState(null);

    const [application, setApplication] = useState({ shortName: 'init' });
    const { t } = useTranslation();

    const styles = {
        weekContainer: {
            display: 'flex',
            justifyContent: 'space-around'
        }
    };

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
                        margin={0}
                        variant="fs-24"
                        bold="bold"
                    >
                        Dias e horários com atendimento
                    </BdsTypo>

                    <div className="mt2">
                        <BdsTypo style={{ color: '#3A4A65' }} variant="fs-15">
                            Preencha os horários de atendimento conforme os dias
                            da semana. Obs.: Você pode adicionar mais de um
                            intervalo de horário por dia.
                        </BdsTypo>
                    </div>
                </BdsPaper>

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
                    <BdsTypo
                        style={{ color: '#3A4A65' }}
                        margin={0}
                        variant="fs-24"
                        bold="bold"
                    >
                        Horários de {currentTeam}
                        <Scheduler currentWorkTime={currentWorkTime} />
                    </BdsTypo>
                </BdsPaper>
            </div>
        </>
    );
};

export default Home;
