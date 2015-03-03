import test from 'tape';
import Dispatcher from './../src/Dispatcher';
import Actions from './../src/Actions';
import Store from './../src/Store';

let handleFooBarCalled = false;
let handleFooBazCalled = false;

class FooStore extends Store {
	constructor(actions) {
		this.listenTo(actions.foo.bar, this.handleFooBar);
		this.listenTo(actions.foo.baz, this.handleFooBaz);
		this.stopListenTo(actions.foo.baz);
	}
	handleFooBar(bar) {
		handleFooBarCalled = true;
		this.setState({bar: bar});
		console.log('handleFooBar');
	}
	handleFooBaz(baz) {
		handleFooBazCalled = true;
	}
}

class FooActions extends Actions {
	bar(bar) {
		return bar;
	}
	baz(baz) {
		return baz;
	}
}

let flux = new Dispatcher({
	actions: {foo: FooActions},
	stores: {foo: FooStore}
});

test('Store:listenTo()', (t) => {
	handleFooBarCalled = false;
	let action = flux.getActions('foo').bar;
	action();
	t.ok(handleFooBarCalled, 'should listen to action');
	t.end();
});

test('Store:stopListenTo()', (t) => {
	handleFooBazCalled = false;
	let action = flux.getActions('foo').baz;
	action();
	t.notOk(handleFooBazCalled, 'should stop listen to action');
	t.end();
});

test('Store:setState()', (t) => {
	let emitted = false;
	let action = flux.getActions('foo').bar;
	let store = flux.getStore('foo');
	store.on('change', () => emitted = true);
	action('bar');

	t.deepEqual(store.getState(), {bar: 'bar'}, 'should set state');
	t.ok(emitted, 'should emit change event');
	t.end();
});