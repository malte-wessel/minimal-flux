import Actions from '../../../../src/Actions';

export default class MessageActions extends Actions {

	receiveAll(rawMessages) {
		return rawMessages;
	}

    receiveCreatedMessage(createdMessage) {
        return createdMessage;
    }

}
