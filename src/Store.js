import { EventEmitter } from 'eventemitter3';
import assign from 'object-assign';

export default class Store extends EventEmitter {

    setState(state) {
        if(!state) return;
        if(!this.state) this.state = {};
        this.state = assign({}, this.state, state);
        this.emit('change', this.state);
    }

    getState() {
        return this.state || {};
    }

}