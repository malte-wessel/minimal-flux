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
        if(!this._handlers) this._handlers = {};    

        if (typeof handler !== 'function') {
            throw new Error(`Handler for action ${id} is not a function. ` + 
                `Attempted to register action handler in ${this.constructor.name}.`);
        }
        if(!this._actionIdExists(id)) {
            throw new Error(`Action ${id} does not exist. ` + 
                `Attempted to register action handler in ${this.constructor.name}.`);
        }
        if(this._handlers[id]) {
            throw new Error(
                `Handler for action ${id} is already registered. ` +
                `Attempted to register action handler in ${this.constructor.name}.`);
        }

        this._handlers[id] = handler.bind(this);
    }

    /**
     * Unregister an action handler
     * @param  {String} id  Id of the action (e.g. 'todos.create')
     * @return {void}
     */
    stopHandleAction(id) {
        if(!id || !this._handlers || !this._handlers[id]) return;
        this._handlers[id] = undefined;
    }

    /**
     * Set state
     * @param {Object} state State object
     */
    setState(state, options = {}) {
        if(!state) return;
        if(!this.state) this.state = {};
        this.state = assign({}, this.state, state);

        if(options.silent !== true) {
            this.emit('change', this.state);
        }
    }

    /**
     * Returns the state
     * @return {Object} The state object
     */
    getState() {
        return this.state || {};
    }

    /**
     * Check if action id exists
     * @return {Boolean}
     */
    _actionIdExists(id) {
        // This method will be overriden by the dispatcher.
        // When testing stores without the dispatcher, always return true
        return true;
    }

}