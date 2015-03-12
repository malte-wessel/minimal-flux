import test from 'tape';
import Dispatcher from './../src/Dispatcher';
import Actions from './../src/Actions';
import Store from './../src/Store';

let flux;

class FooStore extends Store {

    constructor() {
        this.handleAction('foo.foo', function() {
            flux.actions.foo.bar();
        });
    }

}

class FooActions extends Actions {
    foo() {
        this.dispatch('foo');
    }
    bar() {
        this.dispatch('bar');
    }
}

flux = new Dispatcher({
    stores: {foo: FooStore},
    actions: {foo: FooActions}
});

test('Dispatch while dispatching', (t) => {
    t.throws(() => flux.actions.foo.foo(), 'should throw error');
    t.end();
});