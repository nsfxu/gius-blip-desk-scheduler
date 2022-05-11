import { IframeMessageProxy } from 'iframe-message-proxy';
import IMPContainer from '../constants/iframe-message-proxy-container';
import { filterBlankObject, filterPromiseArray } from '../utils/object';

const PORTAL_NODE = 'postmaster@portal.blip.ai';
const CONFIGURATION_URI = `lime://${PORTAL_NODE}/configuration`;
const CONTACTS_URI = '/contacts';
const THREADS_URI = '/threads';
const APPLICATIONS_PATH = `/applications`;
const JSON_TYPE = 'application/json';

const getApplicationDataAsync = async (fullIdentity = null) => {
    const { response: application } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.GET_APPLICATION,
        content: fullIdentity
    });
    if (application) {
        return application;
    }
    return { shortName: 'null' };
};

const getBotDataAsync = async (identity) => {
    try {
        const { response } = await IframeMessageProxy.sendMessage({
            action: IMPContainer.Actions.SEND_COMMAND,
            content: {
                destination: IMPContainer.Destinations.BLIP_SERVICE,
                command: {
                    method: IMPContainer.CommandMethods.GET,
                    to: PORTAL_NODE,
                    uri: `${APPLICATIONS_PATH}/${identity}`
                }
            }
        });

        const data = { ...response, identity };

        return data;
    } catch (err) {
        return false;
    }
};

const getAllowedSubbotsAsync = async (application) => {
    const {
        applicationJson: { settings: appSettings }
    } = application;

    if (!!appSettings?.children) {
        const identities = appSettings.children.map((bot) => bot.identity);
        const promises = identities.map((identity) =>
            getBotDataAsync(identity)
        );
        const result = await Promise.allSettled(promises);
        const subbotsData = filterPromiseArray(result);
        const subbotsList = filterBlankObject(subbotsData);

        return subbotsList;
    }

    return false;
};

const getConfigurationDataAsync = async () => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.SEND_COMMAND,
        content: {
            command: {
                method: IMPContainer.CommandMethods.GET,
                uri: CONFIGURATION_URI
            }
        }
    });

    return response;
};

const setConfigurationDataAsync = async (payload) => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.SEND_COMMAND,
        content: {
            command: {
                method: IMPContainer.CommandMethods.SET,
                uri: CONFIGURATION_URI,
                type: JSON_TYPE,
                resource: payload
            }
        }
    });

    return response;
};

const getCurrentLanguageAsync = async () => {
    const { response } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.GET_CURRENT_LANGUAGE
    });

    return response;
};

const getContactsAsync = async () => {
    const {
        response: { items }
    } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.SEND_COMMAND,
        content: {
            destination: IMPContainer.Destinations.MESSAGING_HUB_SERVICE,
            command: {
                method: IMPContainer.CommandMethods.GET,
                uri: CONTACTS_URI
            }
        }
    });

    return items;
};

const getThreadsAsync = async () => {
    const {
        response: { items }
    } = await IframeMessageProxy.sendMessage({
        action: IMPContainer.Actions.SEND_COMMAND,
        content: {
            destination: IMPContainer.Destinations.MESSAGING_HUB_SERVICE,
            command: {
                method: IMPContainer.CommandMethods.GET,
                uri: THREADS_URI
            }
        }
    });

    return items;
};

export {
    getApplicationDataAsync,
    getBotDataAsync,
    getAllowedSubbotsAsync,
    getConfigurationDataAsync,
    setConfigurationDataAsync,
    getCurrentLanguageAsync,
    getContactsAsync,
    getThreadsAsync
};
