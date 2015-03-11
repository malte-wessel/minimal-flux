import React from 'react';

class MessageListItem extends React.Component {

    render() {
        var message = this.props.message;
        return (
            <li className="message-list-item">
                <h5 className="message-author-name">{message.authorName}</h5>
                <div className="message-time">
                    {message.date.toLocaleTimeString()}
                </div>
                <div className="message-text">{message.text}</div>
            </li>
        );
    }
}

MessageListItem.propTypes = {
    message: React.PropTypes.object
};

export default MessageListItem;