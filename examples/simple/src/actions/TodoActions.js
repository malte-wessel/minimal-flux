import uniqueid from 'uniqueid';
import Actions from './../../../../src/Actions';

export default class TodoActions extends Actions {

	fetch() {
		// Invoke wait action
		this.fetchWait();

		// Pretend web api call
		setTimeout(() => {
			var data = [
				{id: uniqueid(), title: 'Reimplement flux'},
				{id: uniqueid(), title: 'Drop Backbone'},
				{id: uniqueid(), title: 'Travel'},
			];
			this.fetchCompleted(data);
		}, 500);
	}

	fetchWait() {
		this.emit('fetchWait');
	}

	fetchCompleted(data) {
		this.emit('fetchCompleted', data);
	}

	fetchFailed(err) {
		this.emit('fetchFailed', err);
	}

	create(title) {
		this.emit('create', title);
	}

	destroy(id) {
		this.emit('destroy', id);
	}
}