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

    constructor(options) {
        this.actions = {};
        this.stores = {};
        this._stores = {};
        this.order = [];

        let actions = options.actions || {};
        let stores = options.stores || {};

        this.createActions(actions);
        this.createStores(stores);
    }

    dispatch(actionId, ...args) {
        let stores = this._stores;
        
        for (let key of this.order) {
            let handlers = stores[key]._handlers;
            if(!handlers || !handlers[actionId]) continue;
            handlers[actionId](...args);
        }
    }

    createActions(actions) {
        for(let key in actions) {

            let Actions = actions[key];
            assign(Actions.prototype, { actions: this.actions });

            let instance = new Actions();

            this.actions[key] = {};

            let props = getAllPropertyNames(instance).filter((prop) => {
                // Ignore the base class properties
                return allActionsProperties.indexOf(prop) < 0 &&
                    // Only regard functions
                    typeof instance[prop] == 'function';
            });

            for(let prop of props) {
                let fn = instance[prop].bind(instance);
                let id = [key, prop].join('.');
                instance.addListener(prop, this.dispatch.bind(this, id));
                this.actions[key][prop] = fn;
            }
        }
    }

    createStores(stores) {
        let nodes = [];
        let edges = [];

        // Create edges between dependencies
        for(let key in stores) {
            nodes.push(key);
            let store = stores[key];
            if(!Array.isArray(store)) continue;
            let deps = store.slice(1) || [];
            for(let dep of deps) edges.push([key, dep]);
        }

        // Topological sort
        let order = this.order = toposort.array(nodes, edges).reverse();

        for(let i = 0, l = order.length; i < l; i++){
            let key = order[i];
            let Store = stores[key];

            if(Array.isArray(Store)) Store = Store[0];  
            assign(Store.prototype, { stores: this.stores });

            let instance = new Store();
            this._stores[key] = instance;
            this.stores[key] = {};

            let props = getAllPropertyNames(instance).filter((prop) => {
                // Only regard functions
                return typeof instance[prop] === 'function' &&
                    // Functions that start with get
                    (prop.indexOf('get') === 0 || 
                        // Event emitter function, except emit
                        (eventEmitterProperties.indexOf(prop) > -1 && prop !== 'emit'));
            });

            for(let prop of props) {
                this.stores[key][prop] = instance[prop].bind(instance);
            }
        }
    }

}