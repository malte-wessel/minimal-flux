import Actions from '../../../../src/Actions';

export default class MessageActions extends Actions {

    receiveAll(rawMessages) {
        this.dispatch('receiveAll', rawMessages);
    }

    receiveCreatedMessage(createdMessage) {
        this.dispatch('receiveCreatedMessage', createdMessage);
    }

}
