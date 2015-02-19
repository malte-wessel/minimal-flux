import Flux from './../src/Flux';
import Actions from './../src/Actions';
import Store from './../src/Store';
import test from 'tape';

var flux = new Flux({
    actions: {foo: Actions},
    stores: {foo: Store}
});

test('Flux() is extendable', (t) => {
    t.ok(typeof Flux == 'function', 'Flux is a function');
    t.end();
});

test('Flux() will create actions and stores', (t) => {
    t.ok(flux.actions.foo instanceof Actions, 'creates actions');
    t.ok(flux.stores.foo instanceof Store, 'creates stores');
    t.end();
});

test('flux#getActions() returns actions', (t) => {
    t.ok(flux.getActions('foo') instanceof Actions, 'returns actions');
    t.end();
});

test('flux#getStores() returns stores', (t) => {
    t.ok(flux.getStore('foo') instanceof Store, 'returns store');
    t.end();
});