import { EventEmitter } from 'eventemitter3';

export default class Actions extends EventEmitter {

	emit(event, ...args) {
		if(typeof this[event] !== 'function') {
			console.warn(`${this.constructor.name} emitted \`${event}\`. This action is not implemented and can therefore not be dispatched.`);
		}

		return super.emit(event, ...args);
	}

}