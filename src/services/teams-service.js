import { IframeMessageProxy } from 'iframe-message-proxy';
import IMPConstants from '../constants/iframe-message-proxy-container';

const BASE_URI = '/teams';

const getAllTeamsAsync = async () => {
    try {
        const { response } = await IframeMessageProxy.sendMessage({
            action: IMPConstants.Actions.SEND_COMMAND,
            content: {
                destination: IMPConstants.Destinations.MESSAGING_HUB_SERVICE,
                command: {
                    to: 'postmaster@desk.msging.net',
                    method: IMPConstants.CommandMethods.GET,
                    uri: BASE_URI
                }
            }
        });
        return response;
    } catch (error) {
        return {};
    }
};

/*
const saveResourceAsync = async (resource, content) => {
    try {
        const { response } = await IframeMessageProxy.sendMessage({
            action: IMPConstants.Actions.SEND_COMMAND,
            content: {
                destination: IMPConstants.Destinations.MESSAGING_HUB_SERVICE,
                command: {
                    method: IMPConstants.CommandMethods.SET,
                    uri: `${BASE_URI}/${resource}`,
                    type: APP_JSON,
                    resource: JSON.stringify(content)
                }
            }
        });
        return response;
    } catch (error) {
        return {};
    }
};
*/

export { getAllTeamsAsync };
