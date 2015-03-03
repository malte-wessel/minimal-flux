import Dispatcher from './Dispatcher';

export default class Flux extends Dispatcher {

	constructor(...args) {
		super(...args);
		return {
            getActions: this.getActions.bind(this),
            getStore: this.getStore.bind(this)
        };
	}
}