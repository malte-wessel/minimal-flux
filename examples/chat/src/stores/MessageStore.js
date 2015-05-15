import Store from '../../../../src/Store';
import ChatMessageUtils from '../utils/ChatMessageUtils';

export default class MessageStore extends Store {

    constructor() {
        super();
        this.setState({messages: {}});
        this.handleAction('threads.clickThread', this.handleClickThread);
        this.handleAction('messages.createMessage', this.handleCreateMessage);
        this.handleAction('server.receiveAll', this.handleReceiveAll);
    }

    handleClickThread(threadId) {
        this.markAllInThreadRead(this.stores.threads.getCurrentId());
    }

    handleCreateMessage(text, threadId) {
        this.addMessage(text, threadId);
    }

    handleReceiveAll(rawMessages) {
        this.addMessages(rawMessages);
        this.markAllInThreadRead(this.stores.threads.getCurrentId());
    }

    markAllInThreadRead(threadId) {
        let { messages } = this.getState();
        for (let id in messages) {
            if (messages[id].threadId !== threadId) continue;
            messages[id].isRead = true;
        }
        this.setState({ messages });
    }

    addMessage(text, threadId) {
        let { messages } = this.getState();
        var message = ChatMessageUtils.getCreatedMessageData(text, threadId);
        messages[message.id] = message;
        this.setState({ messages });
    }

    addMessages(rawMessages) {
        let { messages } = this.getState();
        let threadStore = this.stores.threads;

        rawMessages.forEach(function(message) {
            if (messages[message.id]) return;
            messages[message.id] = ChatMessageUtils.convertRawMessage(message, threadStore.getCurrentId());
        });

        this.setState({ messages });
    }

    get(id) {
        return this.state.messages[id];
    }

    getAll() {
        return this.state.messages;
    }

    getAllForThread(threadId) {
        let { messages } = this.getState();
        let threadMessages = [];

        for (let id in messages) {
            if (messages[id].threadId !== threadId) continue;
            threadMessages.push(messages[id]);
        }

        threadMessages.sort(function(a, b) {
            if (a.date < b.date) return -1;
            else if (a.date > b.date) return 1;
            return 0;
        });
        
        return threadMessages;
    }

    getAllForCurrentThread() {
        let threadStore = this.stores.threads;
        return this.getAllForThread(threadStore.getCurrentId());
    }
}
