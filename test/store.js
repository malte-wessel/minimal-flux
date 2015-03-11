import test from 'tape';
import Dispatcher from './../src/Dispatcher';
import Actions from './../src/Actions';
import Store from './../src/Store';

let handlerCalled = [];
let constructed = [];
let handled = [];

class FooStore extends Store {
    constructor() {
        constructed.push('foo');
        this.handleAction('foo.foo', this.handleFooFoo);
        this.handleAction('foo.bar', this.handleFooBar);
        this.handleAction('foo.baz', this.handleFooBaz);
    }

    handleFooFoo(foo) {
        handlerCalled.push(['foo.foo', foo]);
        handled.push('foo');
    }

    handleFooBar(bar) {
        handlerCalled.push(['foo.bar', bar]);
        this.stopHandleAction('foo.bar');
    }

    handleFooBaz(baz) {
        handlerCalled.push(['foo.baz', baz]);
        this.setState({baz: baz});
    }
}

let barStoreFoo;
class BarStore extends Store {
    constructor() {
        constructed.push('bar');
        barStoreFoo = this.stores.foo;
        this.handleAction('foo.foo', this.handleFooFoo);
    }

    handleFooFoo(foo) {
        handled.push('bar');
    }
}

class BazStore extends Store {
    constructor() {
        constructed.push('baz');
        this.handleAction('foo.foo', this.handleFooFoo);
    }

    handleFooFoo(foo) {
        handled.push('baz');
    }
}

class FooActions extends Actions {
    foo(foo) {
        this.emit('foo', foo);
    }
    bar(bar) {
        this.emit('bar', bar);
    }
    baz(baz) {
        this.emit('baz', baz);
    }
}

let flux = new Dispatcher({
    actions: {foo: FooActions},
    stores: {
        foo: FooStore,
        bar: [BarStore, 'foo', 'baz'],
        baz: BazStore
    }
});

test('Store: resolve stores', (t) => {
    t.ok(constructed.indexOf('bar') === 2, 
        'should resolve in a topological order');

    t.ok(barStoreFoo === flux.stores.foo, 
        'should make stores available at construction time');

    t.end();
});

test('Store: circular dependencies', (t) => {
    let circle = function() {
        new Dispatcher({
            stores: {
                foo: [FooStore, 'bar'],
                bar: [BarStore, 'foo']
            }
        });
    };

    t.throws(circle, 'should throw error');
    t.end();
});

test('Store: decoration', (t) => {

    let store = flux.stores.foo;

    t.notOk(typeof store.setState === 'function',
        'should not expose setters');

    t.ok(typeof store.getState === 'function',
        'should expose getters');

    t.ok(typeof store.addListener === 'function',
        'should expose event emitter methods');

    t.end();
});

test('Store: handleAction()', (t) => {
    handlerCalled = [];
    flux.actions.foo.foo('foo');

    t.deepEqual(handlerCalled, [['foo.foo', 'foo']],
        'should listen to action');

    t.end();
});

test('Store: stopHandleAction()', (t) => {
    handlerCalled = [];
    flux.actions.foo.bar('bar');
    flux.actions.foo.bar('bar');

    t.deepEqual(handlerCalled, [['foo.bar', 'bar']],
        'should stop listen to action');

    t.end();
});

test('Store: dispatch actions', (t) => {
    t.ok(handled.indexOf('bar') > handled.indexOf('baz'),
        'should dispatch action in a topological order');

    t.end();
});

test('Store: setState()', (t) => {
    let emitted = false;
    let store = flux.stores.foo;

    store.on('change', () => emitted = true);
    flux.actions.foo.baz('baz');

    t.deepEqual(store.getState(), {baz: 'baz'}, 
        'should set state');

    t.ok(emitted, 
        'should emit change event');

    t.end();
});