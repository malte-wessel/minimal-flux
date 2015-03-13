import Actions from '../../../../src/Actions';

export default class MessageActions extends Actions {

    createMessage(text, threadId) {
        this.dispatch('createMessage', text, threadId);
    }

}
