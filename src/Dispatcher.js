import assign from 'object-assign';
import { EventEmitter } from 'eventemitter3';
import toposort from 'toposort';
import getAllPropertyNames from 'getallpropertynames';

let actionIds = 0;
let eventEmitterMethods = Object.keys(EventEmitter.prototype).filter(k => typeof EventEmitter.prototype[k] === 'function');

function keys(obj) {
    return Object.keys(obj);
}

export default class Dispatcher {

    constructor(options) {
        this.actions = {};
        this.actionIds = {};
        this.actionsById = {};
        this.actionsDecorators = {};

        this.stores = {};
        this.storeDecorators = {};

        let actions = options.actions || {};
        let stores = options.stores || {};

        this.createActions(actions);
        this.createStores(stores);
    }

    dispatch(actionId, ...args) {
        let stores = this.stores;
        
        for (let key of this.order) {
            let handlers = stores[key]._handlers;
            if(!handlers || !handlers[actionId]) continue;
            handlers[actionId](...args);
        }
    }

    createActions(actions) {
        let obj = {};
        for(let key in actions) {
            let Actions = actions[key];

            assign(Actions.prototype, {
                getActions: this.getActions.bind(this)
            });

            let actionsInstance = new Actions();

            this.actions[key] = actionsInstance;
            this.actionIds[key] = {};
            this.actionsDecorators[key] = {};

            for(let action of getAllPropertyNames(actionsInstance)) {
                // Ignore object prototype functions
                if(obj[action]) continue;
                if(eventEmitterMethods.indexOf(action) > -1) continue;
                // Ignore constructor
                if(action === 'constructor') continue;
                // Ignore getter
                if(action === 'getActions') continue;
                if(typeof actionsInstance[action] !== 'function') continue;

                let actionId = 'a' + actionIds++;
                let actionFn = actionsInstance[action].bind(actionsInstance);

                actionsInstance.addListener(action, this.dispatch.bind(this, actionId));

                this.actionIds[key][action] = actionId;
                this.actionsById[actionId] = actionFn;
                this.actionsDecorators[key][action] = actionFn;
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

        let instances = this.stores;

        for(let i = 0, l = order.length; i < l; i++){
            let key = order[i];
            let Store = stores[key];

            if(Array.isArray(Store)) Store = Store[0];   

            assign(Store.prototype, {
                getStore: this.getStore.bind(this),
                getActions: this.getActions.bind(this)
            });

            let store = new Store(this.actionIds);
            this.stores[key] = store;

            let decorator = {};

            for(let prop of getAllPropertyNames(store)) {
                let fn = store[prop];
                if(prop === 'constructor' || prop === 'getStore' || prop === 'getActions') continue;
                if(typeof fn !== 'function') continue;

                if(prop.indexOf('get') === 0 || eventEmitterMethods.indexOf(prop) > -1) {
                    decorator[prop] = store[prop].bind(store);    
                }
            }
            this.storeDecorators[key] = decorator;
        }
    }

    getStore(key) {
        if(!key) return this.storeDecorators;
        return this.storeDecorators[key];
    }

    getActions(key) {
        if(!key) return this.actionsDecorators;
        return this.actionsDecorators[key];
    }

}