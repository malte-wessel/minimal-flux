export default class Flux {

    constructor(options) {
        this.actions = this.createActions(options.actions);
        this.stores = this.createStores(options.stores);
    }

    createActions(actions) {
        for(let key in actions) actions[key] = new actions[key](this);
        return actions;
    }

    createStores(stores) {
        for(let key in stores) stores[key] = new stores[key](this);
        return stores;
    }

    getActions(key) {
        return this.actions[key];
    }

    getStore(key) {
        return this.stores[key];
    }

}