import assign from 'object-assign';
import { EventEmitter } from 'eventemitter3';
import toposort from 'toposort';
import getAllPropertyNames from 'getallpropertynames';
import Actions from './Actions';
import Store from './Store';

let allActionsProperties = getAllPropertyNames(Actions.prototype);
let allStoreProperties = getAllPropertyNames(Store.prototype);
let eventEmitterProperties = Object.keys(EventEmitter.prototype);

export default class Dispatcher {

    /**
     * Constructor
     * @param  {Object} options
     * @param  {Object} options.actions Namespaced actions
     * @param  {Object} options.stores  Namespaced stores
     * @return {Dispatcher}
     */
    constructor(options) {
        // Decorated actions
        this.actions = {};
        this.actionIds = [];
        // Decorated stores
        this.stores = {};
        // Actual stores
        this._stores = {};
        // Order in which actions get dispatched to the stores
        this.order = [];

        let actions = options.actions || {};
        let stores = options.stores || {};

        this.createActions(actions);
        this.createStores(stores);
    }

    /**
     * Dispatches an action
     * @param  {String}    id   The id of the action (e.g. 'todos.create')
     * @param  {...mixed}  args Arguments that will be passed to the handlers
     * @return {void}
     */
    dispatch(id, ...args) {
        if(this._isDispatching) {
            throw new Error('Cannot dispatch in the middle of a dispatch.');
        }

        this._isDispatching = true;

        // Run through stores and invoke registered handlers
        let stores = this._stores;
        for (let key of this.order) {
            let handlers = stores[key]._handlers;
            if(!handlers || !handlers[id]) continue;
            handlers[id](...args);
        }

        this._isDispatching = false;
    }

    /**
     * Create actions
     * @param  {Object} actions Namespaced actions
     * @return {void}
     */
    createActions(actions) {
        // Run through namespaced actions
        for(let key in actions) {
            let Actions = actions[key];
            // Make actions available at construction time
            assign(Actions.prototype, { actions: this.actions });
            // Instantiate actions
            let instance = new Actions();
            // Create decorated actions object
            this.actions[key] = {};
            // Find actual action function
            let props = getAllPropertyNames(instance).filter((prop) => {
                // Ignore the base class properties
                return allActionsProperties.indexOf(prop) < 0 &&
                    // Only regard functions
                    typeof instance[prop] == 'function';
            });
            // Run through actual actions
            for(let prop of props) {
                // Bind function to instance
                let fn = instance[prop] = instance[prop].bind(instance);
                // The action id is composed from the actions key and its function name
                let id = [key, prop].join('.');
                this.actionIds.push(id);
                // Listen to the action event
                instance.addListener(prop, this.dispatch.bind(this, id));
                // Add function to the decorated object
                this.actions[key][prop] = fn;
            }
        }
    }

    /**
     * Check if action id exists
     * @param  {String} id The action id
     * @return {Boolean}
     */
    actionIdExists(id) {
        return this.actionIds.indexOf(id) > -1;
    }

    /**
     * Create stores
     * @param  {Object} stores Namespaced stores
     * @return {void}
     */
    createStores(stores) {
        let nodes = [];
        let edges = [];

        // Create a dependency graph
        for(let key in stores) {
            nodes.push(key);
            let store = stores[key];
            // If store is not an array, it has no dependencies
            if(!Array.isArray(store)) continue;
            let deps = store.slice(1) || [];
            // Add edges between store and it dependencies
            for(let dep of deps) edges.push([key, dep]);
        }

        // Topological sort, store the order
        let order = this.order = toposort.array(nodes, edges).reverse();

        // Run through ordered stores
        for(let i = 0, l = order.length; i < l; i++){
            let key = order[i];
            let Store = stores[key];
            // Handle plain and array definition
            if(Array.isArray(Store)) Store = Store[0];  
            // Make stores available at construction time
            assign(Store.prototype, {
                stores: this.stores,
                _actionIdExists: this.actionIdExists.bind(this)
            });
            // Instantiate the store
            let instance = new Store();
            this._stores[key] = instance;
            // Create a decorated stores object
            this.stores[key] = {};
            // Find functions that will be added to the decorated object
            let props = getAllPropertyNames(instance).filter((prop) => {
                // Only regard functions
                return typeof instance[prop] === 'function' &&
                    // Functions that start with get
                    (prop.indexOf('get') === 0 || 
                        // Event emitter function, except emit
                        (eventEmitterProperties.indexOf(prop) > -1 && prop !== 'emit'));
            });
            // Run through functions
            for(let prop of props) {
                // Bind function to the instance and add it to the decorated object
                this.stores[key][prop] = instance[prop].bind(instance);
            }
        }
    }

}