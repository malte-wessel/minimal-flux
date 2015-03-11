import React from 'react';
import cx from 'react/lib/cx';

class ThreadListItem extends React.Component {

	constructor(props, context) {
        super(props, context);
		this.onClick = this.onClick.bind(this);
	}

	onClick() {
		let threadActions = this.context.flux.actions.threads;
		threadActions.clickThread(this.props.thread.id);
	}

	render() {
		let thread = this.props.thread;
		let lastMessage = thread.lastMessage;
		let className = cx({
			'thread-list-item': true,
			'active': thread.id === this.props.currentThreadId
		});

		return (
			<li className={className} onClick={this.onClick}>
				<h5 className="thread-name">{thread.name}</h5>
				<div className="thread-time">
					{lastMessage.date.toLocaleTimeString()}
				</div>
				<div className="thread-last-message">
					{lastMessage.text}
				</div>
			</li>
		);
	}
}

ThreadListItem.propTypes = {
	thread: React.PropTypes.object,
    currentThreadId: React.PropTypes.string
};

ThreadListItem.contextTypes = {
    flux: React.PropTypes.object
};

export default ThreadListItem;