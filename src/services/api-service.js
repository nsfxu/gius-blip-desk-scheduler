import api from '../factory/api';

const COMMANDS_URI = 'https://http.msging.net/commands';

const TO = 'postmaster@desk.msging.net';
const METHOD = 'get';
const TEAMS_URI = `/teams`;

const getAllTeams = async (attendanceBotKey) => {
    const body = {
        id: '{{$guid}}',
        method: METHOD,
        to: TO,
        uri: TEAMS_URI
    };

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${attendanceBotKey}`
        }
    };

    try {
        const response = await api.post(COMMANDS_URI, body, config);
        return response;
    } catch (_) {
        return false;
    }
};

export { getAllTeams };
