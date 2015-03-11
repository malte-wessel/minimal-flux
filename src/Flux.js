import Dispatcher from './Dispatcher';

export default class Flux extends Dispatcher {

    constructor(...args) {
        super(...args);
        return {
            actions: this.actions,
            stores: this.stores
        };
    }
}