import React from 'react';

let ENTER_KEY_CODE = 13;

class MessageComposer extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = { text: '' };
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    onChange(event, value) {
        this.setState({text: event.target.value});
    }

    onKeyDown(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            event.preventDefault();
            let text = this.state.text.trim();
            if (text) {
                this.context.flux.actions.messages.createMessage(text, this.props.threadId);
            }
            this.setState({text: ''});
        }
    }

    render() {
        return (
            <textarea
                className="message-composer"
                name="message"
                value={this.state.text}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
            />
        );
    }
}

MessageComposer.propTypes = {
    threadId: React.PropTypes.string.isRequired
};

MessageComposer.contextTypes = {
    flux: React.PropTypes.object
};

export default MessageComposer;