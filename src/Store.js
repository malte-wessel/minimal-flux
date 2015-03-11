import { EventEmitter } from 'eventemitter3';
import assign from 'object-assign';

export default class Store extends EventEmitter {
	
	handleAction(id, handler) {
		if (typeof handler !== 'function') return;
		if(!this._handlers) this._handlers = {};	
		this._handlers[id] = handler.bind(this);
	}

    stopHandleAction(id) {
        if(!this._handlers || !this._handlers[id]) return;
        this._handlers[id] = undefined;
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