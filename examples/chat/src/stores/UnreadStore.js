import Store from '../../../../src/Store';

export default class UnreadStore extends Store {

    constructor(actions) {
        this.setState({ count: null });
        this.handleAction('threads.clickThread', this.handleClickThread);
        this.handleAction('server.receiveAll', this.handleReceiveAll);
    }

    handleClickThread(threadId) {
        this.setCount();
    }

    handleReceiveAll(rawMessages) {
        this.setCount();
    }

    setCount() {
        let threads = this.stores.threads.getAll();
        let count = 0;
        for (let id in threads) {
            if (threads[id].lastMessage.isRead) continue;
            count++;
        }
        this.setState({ count: count });
    }

    getCount() {
        return this.state.count;
    }
}