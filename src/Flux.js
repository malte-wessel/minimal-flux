function createNamespacedActions(actions) {
    for(let key in actions) actions[key] = new actions[key]();
    return actions;
}

function createNamespacedStores(stores) {
    for(let key in stores) stores[key] = new stores[key]();
    return stores;
}

function wrapNamespacedActions(actions) {
    var wrapped = {};
    for(let key in actions) wrapped[key] = wrapActions(actions[key]);
    return wrapped;
}

function wrapNamespacedActionsEmitter(actions) {
    var wrapped = {};
    for(let key in actions) wrapped[key] = wrapActionsEmitter(actions[key]);
    return wrapped;
}

function wrapNamespacedStores(store) {
    var wrapped = {};
    for(let key in store) wrapped[key] = wrapStore(store[key]);
    return wrapped;
}

function wrapActions(actions) {
    let wrapped = {};
    for(let method of getMethodNames(actions.constructor.prototype)) {
        wrapped[method] = actions[method].bind(actions);
    }
    return wrapped;
}

function wrapActionsEmitter(actions) {
    return {
        addListener: actions.addListener.bind(actions),
        removeListener: actions.removeListener.bind(actions)
    };
}

function getMethodNames(instance) {
    return Object.getOwnPropertyNames(instance)
        .filter(name => name !== 'constructor' && 
            typeof instance[name] === 'function');
}

function wrapStore(store) {
    return {
        addListener: store.addListener.bind(store),
        removeListener: store.removeListener.bind(store),
        getState: store.getState.bind(store)
    };
}

function invokeStoreDidMount(stores, wrappedActions, wrappedStores) {
    for(let key in stores) {
        let store = stores[key];
        if(typeof store.storeDidMount === 'function') {
            store.storeDidMount.call(store, wrappedActions, wrappedStores);
        }
    }
    return stores;
}

export default class Flux {

    /**
     * Constructor
     * @param  {object} options containing the namespaced actions and stores
     * @return {Flux}
     */
    constructor(options) {
        let actions = createNamespacedActions(options.actions);
        let stores = createNamespacedStores(options.stores);

        let wrappedActions = wrapNamespacedActions(actions);
        let wrappedStores = wrapNamespacedStores(stores);
        let actionEmitters = wrapNamespacedActionsEmitter(actions);

        this.actions = wrappedActions;
        this.stores = wrappedStores;

        invokeStoreDidMount(stores, actionEmitters, wrappedStores);
    }

    /**
     * Get namespaced actions
     * @param  {String} key returns an action by key
     * @return {Action}
     */
    getActions(key) {
        return this.actions[key];
    }


    /**
     * Get namespaced store
     * @param  {String} key returns a store by key
     * @return {Store}
     */
    getStore(key) {
        return this.stores[key];
    }

}