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

export { getAllTeamsAsync };
