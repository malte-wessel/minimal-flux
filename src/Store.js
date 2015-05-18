import EventEmitter from 'eventemitter3';
import assign from 'object-assign';

/**
 * @class Store
 * @extends EventEmitter
 */
export default class Store extends EventEmitter {
    
    /**
     * Constructor
     * @return {Store}
     */
    constructor() {
        super();
        // Set initial state on store
        let initialState = this.getInitialState();
        this.setState(initialState, { silent: true });
    }

    /**
     * Default initial state getter
     * @return {Object}
     */
    getInitialState() {
        return {};
    }

    /**
     * Default empty state getter
     * Returns a plain JavaScript object by default
     * Implement `getStateClass` to use a custom class for your state
     * @return {[type]} [description]
     */
    getEmptyState() {
        if(typeof this.getStateClass === 'function') {
            let StateClass  = this.getStateClass();
            return new StateClass();
        }
        return {};
    }

    /**
     * Returns the state
     * @return {Object} The state object
     */
    getState() {
        return this.state;
    }

    /**
     * Returns the state as plain JavaScript object
     * @return {Object}
     */
    getStateAsObject() {
        return this.state;
    }

    /**
     * Set state
     * @param {Object} state State object
     * @param {Object} options
     * @param {Boolean} options.silent Does not emit change event when true
     * @param {Boolean} options.replace Does replace the current state when true
     */
    setState(state, options = {}) {
         if(this._isSettingState) {
            throw new Error('Cannot set state while setting state');
        }

        this._isSettingState = true;

        let { silent, replace } = options;

        let prevState = this._isHandlingAction ? this._pendingState : this.state;
        if(!prevState || replace === true) {
            prevState = this.getEmptyState();
        }

        let nextState = this.assignState(prevState, state);

        if (this._isHandlingAction) {
            this._pendingState = nextState;
            if(silent !== true) this._emitChangeAfterHandlingAction = true;
        } else {
            this.state = nextState;
            if(silent !== true) this.emit('change', this.state);
        }

        this._isSettingState = false;
    }

    /**
     * Replace state with passed state
     * @param  {Object} state
     * @param  {Object} options
     * @return {void}
     */
    replaceState(state, options = {}) {
        options = assign({}, options, { replace: true });
        return this.setState(state, options);
    }

    /**
     * Assign nextState to previousState
     * @param  {Object} prevState
     * @param  {Object} nextState
     * @return {Object}
     */
    assignState(prevState, nextState) {
        return assign({}, prevState, nextState);
    }

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

        this._handlers[id] = this._invokeActionHandler.bind(this, handler);
    }

    /**
     * Internal method to invoke an action handler
     * @param  {Function}  handler
     * @param  {...}       args
     * @return {void}
     */
    _invokeActionHandler(handler, ...args) {
        this._isHandlingAction = true;
        this._pendingState = this.state;
        this._emitChangeAfterHandlingAction = false;

        try {
            handler.call(this, ...args);
        } finally {
            this.state = this._pendingState;
            this._pendingState = undefined;

            if(this._emitChangeAfterHandlingAction === true) {
                this.emit('change');
            }
        }

        this._emitChangeAfterHandlingAction = false;
        this._isHandlingAction = false;
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
     * Check if action id exists
     * @return {Boolean}
     */
    _actionIdExists(id) {
        // This method will be overriden by the dispatcher.
        // When testing stores without the dispatcher, always return true
        return true;
    }

}