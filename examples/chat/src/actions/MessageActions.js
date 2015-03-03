import Actions from '../../../../src/Actions';

export default class MessageActions extends Actions {

    createMessage(text, threadId) {
        return { text, threadId };
    }

}
