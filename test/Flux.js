import test from 'tape';
import Flux from './../src/Flux';
import Actions from './../src/Actions';
import Store from './../src/Store';

test('Flux: expose stores and actions', (t) => {

    class FooActions extends Actions {}
    class FooStore extends Store {}

    let flux = new Flux({
        actions: {foo: FooActions},
        stores: {foo: FooStore}
    });
    
    let exposed = Object.getOwnPropertyNames(flux);

    t.ok(exposed.indexOf('actions') > -1,
        'should expose actions');

    t.ok(exposed.indexOf('stores') > -1,
        'should expose stores');

    t.ok(exposed.length === 2,
        'should only expose actions and stores');

    t.end();
});

test('Flux: create actions and stores with super', (t) => {
    class FooActions extends Actions { foo() {} }
    class FooStore extends Store {}

    class ExtendedFlux extends Flux {
        constructor() {
            super({
                actions: {foo: FooActions},
                stores: {foo: FooStore}
            });
        }
    }

    var flux = new ExtendedFlux();

    t.ok(typeof flux.actions.foo.foo === 'function',
        'should create actions');

    t.ok(typeof flux.stores.foo === 'object',
        'should create stores');

    t.ok(Object.keys(flux).length == 2, 
        'should only expose actions and stores');

    t.end();
});

test('Flux: dispatch event', (t) => {

    let events = [];

    class FooActions extends Actions {
        foo(bar) { this.dispatch('foo', bar); }
    }

    let flux = new Flux({
        actions: {foo: FooActions}
    });

    flux.addListener('dispatch', events.push.bind(events));
    flux.actions.foo.foo('bar');

    t.deepEqual(events, ['foo.foo', 'bar'],
        'should forward dispatch event');

    t.end();

});

test('Flux: error event', (t) => {

    let events = [];

    class FooActions extends Actions {
        foo() { this.dispatch('foo'); }
    }
    class FooStore extends Store {
        constructor() {
            super();
            this.handleAction('foo.foo', this.handleFooFoo);
        }
        handleFooFoo() {
            bug();
        }
    }

    let flux = new Flux({
        actions: {foo: FooActions},
        stores: {foo: FooStore}
    });

    flux.addListener('error', events.push.bind(events));

    try {
        flux.actions.foo.foo();
    } catch (err) {
        t.ok(events[0] instanceof Error,
            'should forward error');
         t.end();
    }

});