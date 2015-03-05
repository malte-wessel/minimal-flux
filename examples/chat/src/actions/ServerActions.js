import Actions from '../../../../src/Actions';

export default class MessageActions extends Actions {

	receiveAll(rawMessages) {
		this.emit('receiveAll', rawMessages);
	}

    receiveCreatedMessage(createdMessage) {
    	this.emit('receiveCreatedMessage', createdMessage);
    }

}
