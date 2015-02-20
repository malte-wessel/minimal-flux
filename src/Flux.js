function createActions(actions) {
    for(let key in actions) actions[key] = new actions[key](this);
    return actions;
}

function createStores(stores) {
    for(let key in stores) stores[key] = new stores[key](this);
    return stores;
}

export default class Flux {

    /**
     * Constructor
     * @param  {object} options containing the namespaced actions and stores
     * @return {Flux}
     */
    constructor(options) {
        this.actions = createActions(options.actions);
        this.stores = createStores(options.stores);
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