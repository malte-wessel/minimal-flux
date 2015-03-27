import Actions from '../../../../src/Actions';
import ChatMessageUtils from '../utils/ChatMessageUtils';
import ChatWebAPIUtils from '../utils/ChatWebAPIUtils';

export default class MessageActions extends Actions {

    createMessage(text, threadId) {
        this.dispatch('createMessage', text, threadId);
        var message = ChatMessageUtils.getCreatedMessageData(text, threadId);
    	ChatWebAPIUtils.createMessage(message);
    }

}
