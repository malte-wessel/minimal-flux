import React from 'react';
import MessageComposer from './MessageComposer';
import MessageListItem from './MessageListItem';

class MessageSection extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.onChange = this.onChange.bind(this);
        this.state = this.getStateFromStores();
    }

    getStateFromStores() {
        let stores = this.context.flux.getStore();
        return {
            messages: stores.messages.getAllForCurrentThread(),
            thread: stores.threads.getCurrent()
        };
    }

    setStateFromStores() {
        this.setState(this.getStateFromStores());
    }

    componentDidMount() {
        this.scrollToBottom();
        let stores = this.context.flux.getStore();
        stores.messages.addListener('change', this.onChange);
        stores.threads.addListener('change', this.onChange);
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentWillUnmount() {
        let stores = this.context.flux.getStore();
        stores.messages.addListener('change', this.onChange);
        stores.threads.addListener('change', this.onChange);
    }

    scrollToBottom() {
        var ul = this.refs.messageList.getDOMNode();
        ul.scrollTop = ul.scrollHeight;
    }

    onChange() {
        this.setState(this.getStateFromStores());
    }

    render() {
        var messageListItems = this.state.messages.map((message) => {
            return (
                <MessageListItem
                    key={message.id}
                    message={message}
                />
            );
        });

        return (
            <div className="message-section">
                <h3 className="message-thread-heading">{this.state.thread.name}</h3>
                <ul className="message-list" ref="messageList">
                    {messageListItems}
                </ul>
                <MessageComposer threadId={this.state.thread.id}/>
            </div>
        );
    }
}


MessageSection.contextTypes = {
    flux: React.PropTypes.object
};

export default MessageSection;