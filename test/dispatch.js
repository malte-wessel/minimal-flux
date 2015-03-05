import test from 'tape';
import Dispatcher from './../src/Dispatcher';
import Actions from './../src/Actions';
import Store from './../src/Store';

let handledFoo = [];

class FooStore extends Store {
	constructor(actions) {
		this.listenTo(actions.foo.bar, this.handleFooBar);
	}
	handleFooBar(arg) {
		handledFoo.push('foo');
		this.setState({value: 'foo' + arg});
	}
}

class BarStore extends Store {
	constructor(actions) {
		this.listenTo(actions.foo.bar, this.handleFooBar);
	}
	handleFooBar(arg) {
		handledFoo.push('bar');
		let foo = this.getStore('foo').getState().value;
		let baz = this.getStore('baz').getState().value;
		this.setState({value: arg, foo, baz});
	}
}

class BazStore extends Store {
	constructor(actions) {
		this.listenTo(actions.foo.bar, this.handleFooBar);
	}
	handleFooBar(arg) {
		handledFoo.push('baz');
		this.setState({value: 'baz' + arg});
	}
}

class FooActions extends Actions {
	bar(bar) {
		this.emit('bar', bar);
	}
}

let flux = new Dispatcher({
	actions: {
		foo: FooActions
	},
	stores: {
		foo: FooStore,
		bar: [BarStore, 'foo', 'baz'],
		baz: BazStore
	}
});


test('dispatch', (t) => {
	handledFoo = [];
	let action = flux.getActions('foo').bar;
	let barStore = flux.getStore('bar');
	action('1337');
	
	t.deepEqual(handledFoo, ['baz', 'foo', 'bar'], 'should invoke all handler');
	t.deepEqual(barStore.getState(), {value: '1337', foo: 'foo1337', baz: 'baz1337'}, 'should invoke handler in the correct order');


	t.end();
});