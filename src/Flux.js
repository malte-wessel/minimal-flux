import EventEmitter from 'eventemitter3';
import Dispatcher from './Dispatcher';

export default class Flux extends EventEmitter {

    constructor(...args) {
    	super();

    	var dispatcher = new Dispatcher(...args);

    	// Forward dispatcher events
    	dispatcher.addListener('error', this.emit.bind(this, 'error'));
    	dispatcher.addListener('dispatch', this.emit.bind(this, 'dispatch'));

        this.actions = dispatcher.actions;
        this.stores = dispatcher.stores;
    }
}