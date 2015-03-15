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

    t.end();
});