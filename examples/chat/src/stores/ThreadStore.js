import Store from '../../../../src/Store';
import ChatMessageUtils from '../utils/ChatMessageUtils';

export default class ThreadStore extends Store {

    constructor(actions) {
        this.setState({
            currentId: null,
            threads: {}
        });
        this.listenTo(actions.threads.clickThread, this.handleClickThread);
        this.listenTo(actions.server.receiveAll, this.handleReceiveAll);
    }

    handleClickThread(threadId) {
        let { threads, currentId } = this.getState();
        currentId = threadId;
        threads[currentId].lastMessage.isRead = true;
        this.setState({ threads, currentId });
    }

    handleReceiveAll(rawMessages) {
        this.init(rawMessages);
    }

    init(rawMessages) {
        let threads = this.state.threads;
        let currentId = this.state.currentId;

        rawMessages.forEach((message) => {
            let threadId = message.threadId;
            let thread = threads[threadId];
            
            if (thread && thread.lastTimestamp > message.timestamp) return;

            threads[threadId] = {
                id: threadId,
                name: message.threadName,
                lastMessage: ChatMessageUtils.convertRawMessage(message, currentId)
            };
        });

        if (!currentId) {
            var allChrono = this.getAllChrono();
            currentId = allChrono[allChrono.length - 1].id;
        }

        threads[currentId].lastMessage.isRead = true;
        this.setState({ threads, currentId });
    }

    get(id) {
        return this.state.threads[id];
    }

    getAll() {
        return this.state.threads;
    }

    getAllChrono() {
        let threads = this.state.threads;
        let orderedThreads = [];

        for (let id in threads) {
            let thread = threads[id];
            orderedThreads.push(thread);
        }

        orderedThreads.sort(function(a, b) {
            if (a.lastMessage.date < b.lastMessage.date) return -1;
            else if (a.lastMessage.date > b.lastMessage.date) return 1;
            return 0;
        });

        return orderedThreads;
    }

    getCurrentId() {
        return this.state.currentId;
    }

    getCurrent() {
        return this.get(this.getCurrentId());
    }

}