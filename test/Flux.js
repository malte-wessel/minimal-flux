import Flux from './../src/Flux';
import Actions from './../src/Actions';
import Store from './../src/Store';
import test from 'tape';

class FooActions extends Actions {
    bar() {
        this.emit('bar');
    }
}

class FooStore extends Store {}

var flux = new Flux({
    actions: {foo: FooActions},
    stores: {foo: FooStore}
});

test('Flux', (t) => {
    t.ok(typeof Flux == 'function', 'should be a function');
    t.end();
});

test('Flux()', (t) => {
    t.ok(typeof flux.actions.foo.bar == 'function', 'should creates actions');
    t.ok(typeof flux.stores.foo.getState == 'function', 'should creates stores');
    t.end();
});

test('flux#getActions()', (t) => {
    t.ok(typeof flux.getActions('foo').bar == 'function', 'should returns actions');
    t.end();
});

test('flux#getStores() returns stores', (t) => {
    t.ok(typeof flux.getStore('foo').getState == 'function', 'should returns store');
    t.end();
});