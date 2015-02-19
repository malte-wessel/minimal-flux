import Flux from './../src/Flux';
import Actions from './../src/Actions';
import Store from './../src/Store';
import test from 'tape';

var flux = new Flux({
    actions: {foo: Actions},
    stores: {foo: Store}
});

test('Flux', (t) => {
    t.ok(typeof Flux == 'function', 'should be a function');
    t.end();
});

test('Flux()', (t) => {
    t.ok(flux.actions.foo instanceof Actions, 'should creates actions');
    t.ok(flux.stores.foo instanceof Store, 'should creates stores');
    t.end();
});

test('flux#getActions()', (t) => {
    t.ok(flux.getActions('foo') instanceof Actions, 'should returns actions');
    t.end();
});

test('flux#getStores() returns stores', (t) => {
    t.ok(flux.getStore('foo') instanceof Store, 'should returns store');
    t.end();
});