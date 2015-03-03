import Store from '../../../../src/Store';

export default class UnreadStore extends Store {

    constructor(actions) {
        this.setState({ count: null });
        this.listenTo(actions.threads.clickThread, this.handleClickThread);
        this.listenTo(actions.server.receiveAll, this.handleReceiveAll);
    }

    handleClickThread(threadId) {
        this.setCount();
    }

    handleReceiveAll(rawMessages) {
        this.setCount();
    }

    setCount() {
        let threads = this.getStore('threads').getAll();
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