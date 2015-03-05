import Actions from '../../../../src/Actions';

export default class MessageActions extends Actions {

    createMessage(text, threadId) {
    	this.emit('createMessage', text, threadId);
    }

}
