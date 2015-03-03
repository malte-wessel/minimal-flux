import test from 'tape';
import Dispatcher from './../src/Dispatcher';
import Actions from './../src/Actions';
import Store from './../src/Store';

let actionsCalled = [];

class FooActions extends Actions {
    foo(a) {
        actionsCalled.push('foo.foo');
        return a;
    }
    foo2(a) {
        actionsCalled.push('foo.foo2');
        this.foo3(a);
    }
    foo3(a) {
        actionsCalled.push('foo.foo3');
        return a;
    }
    foo4(a, b, c) {
        actionsCalled.push('foo.foo4');
        return {a, b, c};
    }
}

class BarActions extends Actions {
    bar(a) {
        actionsCalled.push('bar.bar');
        this.getActions('foo').foo();
    }
}

class Bar2Actions extends BarActions {
    bar2() {
        actionsCalled.push('bar2.bar2');
        return 'bar2';
    }
}

let contructionOrder = [];
let fooStoreConstructorArgs;
let barStoreGetStoreResult;

class FooStore extends Store {
    constructor(...args) {
        contructionOrder.push('foo');
        fooStoreConstructorArgs = args;
        this.foo = 'foo';
    }
    getFoo() {return this.foo;}
    setFoo(foo) {this.foo = foo;}
}

class Foo2Store extends FooStore {
    constructor() {
        contructionOrder.push('foo2');
        this.foo = 'foo';
        this.foo2 = 'foo2';
    }
    getFoo2() {return this.foo2;}
    setFoo2(foo2) {this.foo2 = foo2;}
}

class BarStore extends Store {
    constructor() {
        contructionOrder.push('bar');
        barStoreGetStoreResult = this.getStore('foo');
    }
}

class BazStore extends Store {
    constructor() {
        contructionOrder.push('baz');
    }
}

var flux = new Dispatcher({
    actions: {
        foo: FooActions,
        bar: BarActions,
        bar2: Bar2Actions
    },
    stores: {
        foo: FooStore,
        foo2: Foo2Store,
        bar: [BarStore, 'foo'],
        baz: BazStore,
    }
});

test('construction:actions: create actions', (t) => {
    t.ok(flux.actions.foo !== 'undefined', 'should create actions');
    t.ok(flux.actions.foo instanceof FooActions, 'should instantiate actions');
    t.end();
});

test('construction:actions: create action ids', (t) => {
    t.ok(flux.actionIds.foo !== 'undefined', 'should create action ids');
    t.ok(flux.actionIds.foo != flux.actionIds.bars, 'should create unique ids');
    t.end();
});

test('construction:actions: action getter for actions instance', (t) => {
    t.ok(typeof flux.actions.foo.getActions === 'function', 'should add action getter');
    t.ok(flux.actions.foo.getActions('bar') === flux.getActions('bar'), 'should return actions');
    t.end();
});

test('construction:actions: call own actions', (t) => {
    actionsCalled = [];
    flux.getActions('foo').foo2();
    t.deepEqual(actionsCalled, ['foo.foo2', 'foo.foo3'], 'should invoke own actions');
    t.end();
});

test('construction:actions: call other actions', (t) => {
    actionsCalled = [];
    flux.getActions('bar').bar();
    t.deepEqual(actionsCalled, ['bar.bar', 'foo.foo'], 'should invoke other actions');
    t.end();
});

test('construction:actions: decorators', (t) => {
    let fooActionsDecorator = flux.getActions('foo');
    let fooActions = flux.actions.foo;
    t.notOk(fooActionsDecorator instanceof FooActions, 'should decorate actions');
    t.deepEqual(Object.keys(fooActionsDecorator), Object.keys(fooActions), 'should decorate each action');
    t.end();
});

test('construction:actions: decorators multiple inheritance', (t) => {
    let bar2ActionsDecorator = flux.getActions('bar2');
    t.notOk(bar2ActionsDecorator instanceof Bar2Actions, 'should decorate actions');
    t.ok(typeof bar2ActionsDecorator.bar === 'function', 'should decorate inherited actions');
    t.ok(typeof bar2ActionsDecorator.bar2 === 'function', 'should decorate own actions');
    t.end();
});

test('construction:actions: decorators delegation', (t) => {
    actionsCalled = [];
    flux.getActions('foo').foo();
    t.deepEqual(actionsCalled, ['foo.foo'], 'should invoke actual action');
    t.end();
});

test('construction:stores: create stores', (t) => {
    t.ok(flux.stores.foo !== 'undefined', 'should create stores');
    t.ok(flux.stores.foo instanceof FooStore, 'should instantiate stores');
    t.ok(fooStoreConstructorArgs[0] === flux.actionIds, 'should pass action ids to constructor');
    t.end();
});

test('construction:stores: resolve stores', (t) => {
    t.ok(contructionOrder.indexOf('baz') < contructionOrder.indexOf('foo'), 'should resolve in a topological order');
    t.ok(barStoreGetStoreResult === flux.getStore('foo'), 'should make getStores available at construction time');
    t.end();
});

test('construction:stores: decorators', (t) => {
    let fooStoreDecorator = flux.getStore('foo');
    t.notOk(fooStoreDecorator instanceof FooStore, 'should decorate stores');
    t.ok(typeof fooStoreDecorator.addListener === 'function', 'should decorate event emitter functions');
    t.ok(typeof fooStoreDecorator.getFoo === 'function', 'should decorate functions that start with get');
    t.notOk(typeof fooStoreDecorator.setFoo === 'function', 'should not decorate functions that do not start with get');
    t.end();
});

test('construction:stores: decorators multiple inheritance', (t) => {
    let foo2StoreDecorator = flux.getStore('foo2');
    t.notOk(foo2StoreDecorator instanceof Foo2Store, 'should decorate stores');
    t.ok(typeof foo2StoreDecorator.addListener === 'function', 'should decorate event emitter functions');
    t.ok(typeof foo2StoreDecorator.getFoo === 'function', 'should decorate inherited functions that start with get');
    t.notOk(typeof foo2StoreDecorator.setFoo === 'function', 'should not decorate inherited functions that do not start with get');
    t.ok(typeof foo2StoreDecorator.getFoo2 === 'function', 'should decorate own functions that start with get');
    t.notOk(typeof foo2StoreDecorator.setFoo2 === 'function', 'should not decorate own functions that do not start with get');
    t.end();
});

test('construction:actions: decorators delegation', (t) => {
    let fooStore = flux.stores.foo;
    let fooStoreDecorator = flux.getStore('foo');
    t.ok(fooStore.getFoo() === fooStoreDecorator.getFoo(), 'should invoke actual function');
    t.end();
});

test('construction:stores: action and store getter for store instances', (t) => {
    t.ok(typeof flux.stores.foo.getActions === 'function', 'should add action getter');
    t.ok(flux.stores.foo.getActions('bar') === flux.getActions('bar'), 'should return actions');    
    t.ok(typeof flux.stores.foo.getStore === 'function', 'should add store getter');
    t.ok(flux.stores.foo.getStore('bar') === flux.getStore('bar'), 'should return store');
    t.end();
});