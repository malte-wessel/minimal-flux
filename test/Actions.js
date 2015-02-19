import Actions from './../src/Actions';
import test from 'tape';

class FooActions extends Actions {
    foo() {
        this.emit('foo')
    }
}

test('Actions', (t) => {
    t.ok(typeof Actions == 'function', 'should be a function');
    t.end();
});

test('Actions() emit events', (t) => {
    var fooEmitted = false;
    var fooActions = new FooActions();
    fooActions.on('foo', () => {fooEmitted = true});
    fooActions.foo();
    t.ok(fooEmitted === true, 'should emit an event');
    t.end();
});