import test from 'tape';
import '../../util/browser';
import React from 'react/addons';
let { TestUtils } = React.addons;

import BaseFlux from '../../../src/Flux';
import Store from '../../../src/Store';
import Actions from '../../../src/Actions';
import FluxComponent from '../../../src/components/FluxComponent';

class FooActions extends Actions {
    foo(foo) { this.dispatch('foo', foo); }
    foo2(foo2) { this.dispatch('foo2', foo2); }
}

class BarActions extends Actions {
    bar(bar) { this.dispatch('bar', bar); }
    bar2(bar2) { this.dispatch('bar2', bar2); }
}

class FooStore extends Store {
    constructor() {
        super();
        this.state = { foo: 'initial' };
        this.handleAction('foo.foo', this.handleFooFoo);
    }
    handleFooFoo(foo) {
        this.setState({ foo });
    }
}

class BarStore extends Store {
    constructor() {
        super();
        this.state = { bar: 'initial' };
        this.handleAction('foo.foo', this.handleFooFoo);
    }
    handleFooFoo(foo) {
        this.setState({ bar: foo });
    }
}

class Flux extends BaseFlux {
    constructor() {
        super({ 
            actions: {
                foo: FooActions,
                bar: BarActions
            },
            stores: {
                foo: FooStore,
                bar: BarStore,
            }
        });
    }
}

test('FluxComponent: get flux from props or context ', t => {
    let flux = new Flux();

    class Root extends React.Component {
        getChildContext() { return { flux }; }
        render() { return <FluxComponent/>; }
    }
    Root.childContextTypes = {
        flux: React.PropTypes.instanceOf(Flux)
    };

    let tree = TestUtils.renderIntoDocument(<Root />);
    let componentFromContext = TestUtils.findRenderedComponentWithType(tree, FluxComponent);
    let componentFromProps = TestUtils.renderIntoDocument(<FluxComponent flux={flux}/>);

    t.ok(componentFromContext.flux instanceof Flux,
        'should receive flux from context');

    t.ok(componentFromProps.flux instanceof Flux,
        'should receive flux from props');

    t.end();
});

test('FluxComponent: passes flux to children via context', t => {
    let flux = new Flux();

    class Child extends React.Component {
        render() { return <FluxComponent flux={flux}><SubChild/></FluxComponent>; }
    }

    class SubChild extends React.Component {
        render() { return <div/>; }
    }
    SubChild.contextTypes = {
        flux: React.PropTypes.instanceOf(Flux)
    };

    let tree = TestUtils.renderIntoDocument(<Child/>);
    let child = TestUtils.findRenderedComponentWithType(tree, Child);
    let subchild = TestUtils.findRenderedComponentWithType(tree, SubChild);

    t.ok(subchild.context.flux instanceof Flux,
        'should pass flux to children');

    t.end();
});

test('FluxComponent: nested', t => {
    let flux = new Flux();

    class Child extends React.Component {
        render() {
            return (
                <FluxComponent stores={'foo'}>
                    <SubChild/>
                </FluxComponent>
            ); 
        }
    }
    class SubChild extends React.Component {
        render() { return <div/>; }
    }

    let tree = TestUtils.renderIntoDocument(
        <FluxComponent flux={flux}>
            <Child/>
        </FluxComponent>
    );

    let child = TestUtils.findRenderedComponentWithType(tree, Child);
    let subchild = TestUtils.findRenderedComponentWithType(tree, SubChild);

    t.equal(subchild.props.foo, 'initial',
        'should pass initial state to child');

    t.end();
});

test('FluxComponent: connect to single store', t => {
    let flux = new Flux();

    class Child extends React.Component {
        render() { return <div/>; }
    }

    let tree = TestUtils.renderIntoDocument(
        <FluxComponent 
            flux={flux}
            stores={'foo'}>
            <Child/>
        </FluxComponent>
        );

    let child = TestUtils.findRenderedComponentWithType(tree, Child);

    t.equal(child.props.foo, 'initial',
        'should pass initial state to child');

    flux.actions.foo.foo('qux');

    t.equal(child.props.foo, 'qux',
        'should rerender if store changes');

    t.end();
});

test('FluxComponent: stores getter map', t => {
    let flux = new Flux();

    class Child extends React.Component {
        render() { return <div/>; }
    }

    let tree = TestUtils.renderIntoDocument(
        <FluxComponent 
            flux={flux} 
            stores={{
                foo: store => ({ foz: store.getState().foo }),
                bar: store => ({ baz: store.getState().bar})}
            }>
            <Child/>
        </FluxComponent>
        );

    let child = TestUtils.findRenderedComponentWithType(tree, Child);

    t.equal(child.props.foz, 'initial',
        'should pass initial state to child');

    t.equal(child.props.baz, 'initial',
        'should pass initial state to child');

    flux.actions.foo.foo('qux');

    t.equal(child.props.foz, 'qux',
        'should rerender if store changes');

    t.equal(child.props.baz, 'qux',
        'should rerender if store changes');

    t.end();
});

test('FluxComponent: stateGetter', t => {
    let flux = new Flux();

    class Child extends React.Component {
        render() { return <div/>; }
    }

    let tree = TestUtils.renderIntoDocument(
        <FluxComponent
            flux={flux}
            stores={['foo', 'bar']} 
            stateGetter={([foo, bar]) => ({
                qux: foo.getState().foo + bar.getState().bar
            })}>
            <Child/>
        </FluxComponent>
        );

    let child = TestUtils.findRenderedComponentWithType(tree, Child);

    t.equal(child.props.qux, 'initialinitial',
        'should pass initial state to child');

    t.end();
});

test('FluxComponent: actions', t => {
    let flux = new Flux();

    class Child extends React.Component {
        render() { return <div/>; }
    }

    let tree = TestUtils.renderIntoDocument(
        <FluxComponent
            flux={flux}
            actions={'foo'}>
            <Child/>
        </FluxComponent>
        );

    let child = TestUtils.findRenderedComponentWithType(tree, Child);

    t.equal(child.props.foo, flux.actions.foo.foo,
        'should pass actions to child');

    t.equal(child.props.foo2, flux.actions.foo.foo2,
        'should pass actions to child');

    t.end();
});

test('FluxComponent: actions getter map', t => {
    let flux = new Flux();

    class Child extends React.Component {
        render() { return <div/>; }
    }

    let tree = TestUtils.renderIntoDocument(
        <FluxComponent
            flux={flux}
            actions={{
                foo: actions => ({ foz: actions.foo }),
                bar: actions => ({ baz: actions.bar })}
            }>
            <Child/>
        </FluxComponent>
        );

    let child = TestUtils.findRenderedComponentWithType(tree, Child);

    t.equal(child.props.foz, flux.actions.foo.foo,
        'should pass actions to child');

    t.equal(child.props.baz, flux.actions.bar.bar,
        'should pass actions to child');

    t.end();
});

test('FluxComponent: actionsGetter', t => {
    let flux = new Flux();

    class Child extends React.Component {
        render() { return <div/>; }
    }

    let tree = TestUtils.renderIntoDocument(
        <FluxComponent
            flux={flux}
            actions={['foo', 'bar']} 
            actionsGetter={([foo, bar]) => ({
                foz: foo.foo,
                baz: bar.bar
            })}>
            <Child/>
        </FluxComponent>
        );

    let child = TestUtils.findRenderedComponentWithType(tree, Child);

    t.equal(child.props.foz, flux.actions.foo.foo,
        'should pass actions to child');

    t.equal(child.props.baz, flux.actions.bar.bar,
        'should pass actions to child');

    t.end();
});

