import React from 'react';
import ThreadListItem from './ThreadListItem';

class ThreadSection extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.onChange = this.onChange.bind(this);
        this.state = this.getStateFromStores();
    }

    getStateFromStores() {
        let stores = this.context.flux.getStore();
        return {
            threads: stores.threads.getAllChrono(),
            currentThreadId: stores.threads.getCurrentId(),
            unreadCount: stores.unread.getCount()
        };
    }

    setStateFromStores() {
        this.setState(this.getStateFromStores());
    }

    componentDidMount() {
        let stores = this.context.flux.getStore();
        stores.messages.addListener('change', this.onChange);
        stores.unread.addListener('change', this.onChange);
    }

    componentWillUnmount() {
        let stores = this.context.flux.getStore();
        stores.messages.removeListener('change', this.onChange);
        stores.unread.removeListener('change', this.onChange);
    }

    onChange() {
        this.setState(this.getStateFromStores());
    }

    render() {
        var threadListItems = this.state.threads.map(function(thread) {
            return (
                <ThreadListItem
                    key={thread.id}
                    thread={thread}
                    currentThreadId={this.state.currentThreadId}
                />
            );
        }, this);

        var unread = this.state.unreadCount === 0 ? null : <span>Unread threads: {this.state.unreadCount}</span>;

        return (
            <div className="thread-section">
                <div className="thread-count">
                    {unread}
                </div>
                <ul className="thread-list">
                    {threadListItems}
                </ul>
            </div>
        );
    }
}

ThreadSection.contextTypes = {
    flux: React.PropTypes.object
};

export default ThreadSection;