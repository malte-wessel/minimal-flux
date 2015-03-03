import { EventEmitter } from 'eventemitter3';
import assign from 'object-assign';

export default class Store extends EventEmitter {
	
	listenTo(actionId, handler) {
		if (typeof handler !== 'function') return;
		if(!this._handlers) this._handlers = {};	
		this._handlers[actionId] = handler.bind(this);
	}

    stopListenTo(actionId) {
        if(!this._handlers || !this._handlers[actionId]) return;
        this._handlers[actionId] = undefined;
    }

    setState(state) {
        if(!state) return;
        if(!this.state) this.state = {};
        this.state = assign({}, this.state, state);
        this.emit('change', this.state);
    }

    getState() {
        return this.state || {};
    }

}