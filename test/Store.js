import Store from './../src/Store';
import test from 'tape';

class FooStore extends Store {}

test('Store() is extendable', (t) => {
    t.ok(typeof Store == 'function', 'Store is a function');
    t.end();
});

test('actions#setState()', (t) => {
    var changeEmitted = false;
    var store = new FooStore();
    store.on('change', () => {changeEmitted = true});
    store.setState({foo: 'bar'});

    t.deepEqual(store.state, {foo: 'bar'}, 'should update state');
    t.ok(changeEmitted === true, 'should emit change event');
    t.end();
});

test('actions#getState()', (t) => {
    var store = new FooStore();
    store.setState({foo: 'bar'});
    var state = store.getState();
    t.deepEqual(state, {foo: 'bar'}, 'should return state');
    t.end();
});