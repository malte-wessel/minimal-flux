import Dispatcher from './Dispatcher';

export default class Flux {

    constructor(...args) {
    	var dispatcher = new Dispatcher(...args);
        this.actions = dispatcher.actions;
        this.stores = dispatcher.stores;
    }
}