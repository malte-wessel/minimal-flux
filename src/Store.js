import { EventEmitter } from 'eventemitter3';
import assign from 'object-assign';

export default class Store extends EventEmitter {
	
    /**
     * Register an action handler
     * @param  {String}   id      Id of the action (e.g. 'todos.create')
     * @param  {Function} handler Action handler
     * @return {void}
     */
	handleAction(id, handler) {
		if (typeof handler !== 'function') return;
		if(!this._handlers) this._handlers = {};	
		this._handlers[id] = handler.bind(this);
	}

    /**
     * Unregister an action handler
     * @param  {String} id  Id of the action (e.g. 'todos.create')
     * @return {void}
     */
    stopHandleAction(id) {
        if(!this._handlers || !this._handlers[id]) return;
        this._handlers[id] = undefined;
    }

    /**
     * Set state
     * @param {Object} state State object
     */
    setState(state) {
        if(!state) return;
        if(!this.state) this.state = {};
        this.state = assign({}, this.state, state);
        this.emit('change', this.state);
    }

    /**
     * Returns the state
     * @return {Object} The state object
     */
    getState() {
        return this.state || {};
    }

}