import test from 'tape';
import Dispatcher from './../src/Dispatcher';
import Store from './../src/Store';
import Actions from './../src/Actions';

let warnings = [];
console.warn = function(msg) {
    warnings.push(msg);
};

test('Actions: create actions', (t) => {

    class FooActions extends Actions {
        foo() { this.dispatch('foo'); }
    }

    let flux = new Dispatcher({ actions: { foo: FooActions } });

    t.ok(flux.actions.foo !== 'undefined', 'should create actions');

    t.end();
});

test('Actions: binding', (t) => {
    let barContext;
    class FooActions extends Actions {
        foo() { this.bar.call(null); }
        bar() { barContext = this;  }
    }

    let flux = new Dispatcher({ actions: { foo: FooActions } });

    flux.actions.foo.foo();

    t.ok(barContext instanceof FooActions, 
        'should bind methods to actions instance');
    t.end();
});

test('Actions: decorators', (t) => {
    
    class FooActions extends Actions {
        foo() { this.dispatch('foo'); }
        foo2() { this.dispatch('foo2'); }
    }

    class BarActions extends FooActions {
        bar() { this.dispatch('bar'); }
    }

    let flux = new Dispatcher({
        actions: {
            foo: FooActions,
            bar: BarActions
        }
    });

    t.notOk(flux.actions.foo instanceof FooActions, 
        'should decorate actions');

    t.deepEqual(Object.keys(flux.actions.foo), ['foo', 'foo2'], 
        'should decorate each action');

    t.notOk(typeof flux.actions.foo.addListener === 'function', 
        'should not decorate eventemitter functions');

    t.notOk(flux.actions.bar instanceof BarActions, 
        'should decorate actions');

    t.ok(typeof flux.actions.bar.bar === 'function', 
        'should decorate inherited actions');

    t.ok(typeof flux.actions.bar.foo === 'function', 
        'should decorate own actions');

    t.end();
});

test('Actions: access stores', (t) => {
    let storeResult = null;

    class FooActions extends Actions {
        foo() { storeResult = this.stores.foo; }
    }

    class FooStore extends Store {}

    let flux = new Dispatcher({
        actions: { foo: FooActions },
        stores: { foo: FooStore }
    });

    flux.actions.foo.foo();

    t.equal(storeResult, flux.stores.foo, 
        'should make stores getters accessible from actions');

    t.end();
});

test('Actions: invoking actions', (t) => {

    let dispatched = [];

    class FooActions extends Actions {
        foo() { this.dispatch('foo'); }
        bar(a, b, c) { this.dispatch('bar', a, b, c); }
    }

    class ExtendedDispatcher extends Dispatcher {
        dispatch(...args) { dispatched.push(...args); }
    }

    let flux = new ExtendedDispatcher({ actions: { foo: FooActions } });

    dispatched = [];
    flux.actions.foo.foo('foo');
    t.deepEqual(dispatched, ['foo.foo'], 
        'should invoke actual action');

    dispatched = [];
    flux.actions.foo.bar('one', 'two', 'three');
    t.deepEqual(dispatched, ['foo.bar', 'one', 'two', 'three'], 
        'should invoke actions with multiple arguments');

    t.end();
});


test('Actions: invoking actions inside of actions', (t) => {
    
    let dispatched = [];

    class FooActions extends Actions {
        foo(a) { this.dispatch('foo', a); }
        foo2(a) { this.foo(a); }
    }

    class BarActions extends Actions {
        bar(a) { this.actions.foo.foo(a); }
    }

    class ExtendedDispatcher extends Dispatcher {
        dispatch(...args) { dispatched.push(...args); }
    }

    let flux = new ExtendedDispatcher({
        actions: {
            foo: FooActions,
            bar: BarActions
        }
    });

    dispatched = [];
    flux.actions.foo.foo2('foo2');
    t.deepEqual(dispatched, ['foo.foo', 'foo2'], 
        'should invoke own actions');

    dispatched = [];
    flux.actions.bar.bar('bar');
    t.deepEqual(dispatched, ['foo.foo', 'bar'], 
        'should invoke own actions');

    t.end();
});

test('Actions: warn when emitting not implemented actions', (t) => {

    class FooActions extends Actions {
        foo() { this.dispatch('notimplemented'); }
    }

    let flux = new Dispatcher({ actions: { foo: FooActions } });

    warnings = [];
    flux.actions.foo.foo();
    t.deepEqual(warnings, ['FooActions emitted `notimplemented`. This action is not implemented and can therefore not be dispatched.']);
    
    t.end();
});