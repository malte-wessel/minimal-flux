import test from 'tape';
import Dispatcher from './../src/Dispatcher';
import Actions from './../src/Actions';
import Store from './../src/Store';

test('Store: resolve stores', (t) => {

    let constructed = [];
    let barStoreFoo;

    class FooStore extends Store {
        constructor() { constructed.push('foo'); }
    }
    class BarStore extends Store {
        constructor() {
            constructed.push('bar');
            barStoreFoo = this.stores.foo;
        }
    }
    class BazStore extends Store {
        constructor() { constructed.push('baz'); }
    }

    let flux = new Dispatcher({
        stores: {
            foo: FooStore,
            bar: [BarStore, 'foo', 'baz'],
            baz: BazStore
        }
    });

    t.ok(constructed.indexOf('bar') === 2, 
        'should resolve in a topological order');

    t.ok(barStoreFoo === flux.stores.foo, 
        'should make stores available at construction time');

    t.end();
});

test('Store: circular dependencies', (t) => {

    class FooStore extends Store {}
    class BarStore extends Store {}

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

test('Store: decorators', (t) => {

    class FooStore extends Store {}

    class BarStore extends FooStore {}

    let flux = new Dispatcher({
        stores: {
            foo: FooStore
        }
    });

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
    let handled = [];

    class FooActions extends Actions {
        foo(foo) { this.dispatch('foo', foo); }
        bar(bar) { this.dispatch('bar', bar); }
    }

    class FooStore extends Store {
        constructor() {
            this.handleAction('foo.foo', this.handleFooFoo);
            this.handleAction('foo.bar', this.handleFooBar);
        }
        handleFooFoo(...args) {
            handled.push('foo', ...args);
        }
        handleFooBar(...args) {
            handled.push('bar', ...args);
            this.stopHandleAction('foo.bar');
        }
    }

    let flux = new Dispatcher({
        actions: { foo: FooActions },
        stores: { foo: FooStore }
    });

    handled = [];
    flux.actions.foo.foo('foo');
    t.deepEqual(handled, ['foo', 'foo'],
        'should listen to action');

    handled = [];
    flux.actions.foo.bar('bar');
    flux.actions.foo.bar('bar');
    t.deepEqual(handled, ['bar', 'bar'],
        'should stop listen to action');

    t.end();
});

test('Store: handleAction action does not exist', (t) => {
    class FooStore extends Store {
        constructor() {
            this.handleAction('foo.foo', this.handleFooFoo);
        }
        handleFooFoo() {}
    }

    t.throws(() => new Dispatcher({ stores: { foo: FooStore } }), /Action foo.foo does not exist. Attempted to register action handler in FooStore./, 
        'should throw error');

    t.end();
});

test('Store: handleAction handler is undefined', (t) => {
    class FooStore extends Store {
        constructor() {
            this.handleAction('foo.foo', this.notimplemented);
        }
    }

    t.throws(() => new FooStore(), /Handler for action foo.foo is not a function. Attempted to register action handler in FooStore./, 
        'should throw error');

    t.end();
});

test('Store: handleAction handler already registered', (t) => {
    class FooStore extends Store {
        constructor() {
            this.handleAction('foo.foo', this.handleFooFoo);
            this.handleAction('foo.foo', this.handleFooFoo2);
        }
        handleFooFoo() {}
        handleFooFoo2() {}
    }

    t.throws(() => new FooStore(), /Handler for action foo.foo is already registered. Attempted to register action handler in FooStore./, 
        'should throw error');

    t.end();
});

test('Store: setState()', (t) => {
    let emitted = false;
    
    let store = new Store();
    store.addListener('change', () => { emitted = true; });

    store.setState({baz: 'baz'});

    t.deepEqual(store.getState(), {baz: 'baz'}, 
        'should set state');

    t.ok(emitted, 
        'should emit change event');

    t.end();
});

test('Store: setState() silent', (t) => {
    let emitted = false;
    
    let store = new Store();
    store.addListener('change', () => { emitted = true; });

    store.setState({baz: 'baz'}, {silent: true});

    t.deepEqual(store.getState(), {baz: 'baz'}, 
        'should set state');

    t.notOk(emitted, 
        'should not emit change event');

    t.end();
});