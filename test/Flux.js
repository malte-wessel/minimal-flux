import test from 'tape';
import Flux from './../src/Flux';
import Actions from './../src/Actions';
import Store from './../src/Store';

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

test('Expose stores and actions', (t) => {
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

test('Create actions and stores with super', (t) => {
    var flux = new ExtendedFlux();

    t.ok(typeof flux.actions.foo.foo === 'function',
        'should create actions');

    t.ok(typeof flux.stores.foo === 'object',
        'should create stores');

    t.end();
});