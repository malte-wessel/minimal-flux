import test from 'tape';
import Dispatcher from './../src/Dispatcher';
import Actions from './../src/Actions';
import Store from './../src/Store';

test('Dispatcher: dispatch', (t) => {
    let handled = [];

    class FooActions extends Actions {
        foo() { this.dispatch('foo'); }
    }

    class FooStore extends Store {
        constructor() { this.handleAction('foo.foo', this.handleFooFoo); }
        handleFooFoo() { handled.push('foo'); }
    }
    class BarStore extends Store {
        constructor() { this.handleAction('foo.foo', this.handleFooFoo); }
        handleFooFoo() { handled.push('bar'); }
    }
    class BazStore extends Store {
        constructor() { this.handleAction('foo.foo', this.handleFooFoo); }
        handleFooFoo() { handled.push('baz'); }
    }

    let flux = new Dispatcher({
        actions: {
            foo: FooActions
        },
        stores: {
            foo: FooStore,
            bar: [BarStore, 'foo', 'baz'],
            baz: BazStore
        }
    });

    flux.actions.foo.foo();
    t.deepEqual(handled, ['baz', 'foo', 'bar'],
        'should dispatch action in a topological order');

    t.end();

});

test('Dispatcher: dispatch while dispatching', (t) => {

    let flux;

    class FooStore extends Store {
        constructor() {
            this.handleAction('foo.foo', () => flux.actions.foo.bar());
        }
    }

    class FooActions extends Actions {
        foo() { this.dispatch('foo'); }
        bar() { this.dispatch('bar'); }
    }

    flux = new Dispatcher({
        stores: {foo: FooStore},
        actions: {foo: FooActions}
    });

    t.throws(() => flux.actions.foo.foo(), /Cannot dispatch in the middle of a dispatch./, 
        'should throw error');
    
    t.end();

});