import { default as React, PropTypes } from 'react/addons';
import Flux from '../Flux';
import assign from 'object-assign';

/**
 * @class FluxComponent
 * Note: FluxComponent is largely taken from Flummox (https://github.com/acdlite/flummox)
 * Andrew Clark, @acdlite, MIT License
 */
class FluxComponent extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.stateGetters = [];
        this.listeners = {};
        this.flux = this.getFlux();

        this.state = this.connect(props.stores, props.stateGetter);

        this.wrapChild = this.wrapChild.bind(this);
    }

    wrapChild(child) {
        let actions = this.collectActions(this.props.actions, this.props.actionsGetter);
        let props = assign({}, this.state, actions);
        // Using deprecated cloneWithProps. With cloneElement, flux would be undefined
        // https://github.com/facebook/react/issues/3392
        return React.addons.cloneWithProps(child, props);
    }

    render() {
        let { children } = this.props;
        if (!children) return null;

        if (!Array.isArray(children)) {
            let child = children;
            return this.wrapChild(child);
        } else {
            return <span>{React.Children.map(children, this.wrapChild)}</span>;
        }
    }

    getChildContext() {
        let flux = this.getFlux();
        if (!flux) return {};
        console.log('getChildContext', flux);
        return { flux };
    }

    getFlux() {
        return this.props.flux || this.context.flux;
    }

    componentWillUnmount() {
        let flux = this.getFlux();

        for (let key in this.listeners) {
            if (!this.listeners.hasOwnProperty(key)) continue;

            let store = flux.stores[key];
            if (typeof store === 'undefined') continue;

            let listener = this.listeners[key];

            store.removeListener('change', listener);
        }
    }

    componentWillReceiveProps(nextProps) {
        this.updateStores(nextProps);
    }

    updateStores(props = this.props) {
        let state = this.getStoreState(props);
        this.setState(state);
    }

    getStoreState(props = this.props) {
        return this.stateGetters.reduce((result, stateGetter) => {
            let { getter, stores } = stateGetter;
            let stateFromStores = getter(stores, props);
            return assign(result, stateFromStores);
        }, {});
    }

    connect(stateGetterMap = {}, stateGetter = null) {
        let flux = this.getFlux();

        function getStore(key) {
            let store = flux.stores[key];

            if (typeof store === 'undefined') {
                throw new Error(
                    `Store with key '${key}' does not exist.` +
                    `Attempted to connect to store in FluxComponent`
                );
            }
            return store;
        }

        if (typeof stateGetterMap === 'string') {
            let key = stateGetterMap;
            let store = getStore(key);
            let getter = createGetter(stateGetter, defaultStateGetter);

            this.stateGetters.push({ stores: store, getter });
            let listener = createStoreListener(this, store, getter);

            store.addListener('change', listener);
            this.listeners[key] = listener;

        } else if (Array.isArray(stateGetterMap)) {
            let stores = stateGetterMap.map(getStore);
            let getter = createGetter(stateGetter, defaultReduceStateGetter);

            this.stateGetters.push({ stores, getter });
            let listener = createStoreListener(this, stores, getter);

            stateGetterMap.forEach((key, index) => {
                let store = stores[index];
                store.addListener('change', listener);
                this.listeners[key] = listener;
            });

        } else {
             for (let key in stateGetterMap) {
                let store = getStore(key);
                let getter = createGetter(stateGetterMap[key], defaultStateGetter);

                this.stateGetters.push({ stores: store, getter });
                let listener = createStoreListener(this, store, getter);

                store.addListener('change', listener);
                this.listeners[key] = listener;
            }
        }

        return this.getStoreState();
    }

    collectActions(actionMap = {}, actionGetter = null) {
        if (typeof actionMap === 'undefined') return {};

        let flux = this.getFlux();

        function getActions(key) {
            let actions = flux.actions[key];

            if (typeof actions === 'undefined') {
                throw new Error(
                    `Actions with key '${key}' do not exist.` +
                    `Attempted to get actions in FluxComponent`
                );
            }
            return actions;
        }

        let collectedActions = {};

        if (typeof actionMap === 'string') {
            let key = actionMap;
            let actions = getActions(key);
            let getter = createGetter(actionGetter, defaultActionGetter);

            assign(collectedActions, getter(actions));
        } else if (Array.isArray(actionMap)) {
            let actions = actionMap.map(getActions);
            let getter = createGetter(actionGetter, defaultReduceActionGetter);

            assign(collectedActions, getter(actions));
        } else {
            for (let key in actionMap) {
                let actions = getActions(key);
                let getter = createGetter(actionMap[key], defaultActionGetter);

                assign(collectedActions, getter(actions));
            }
        }

        return collectedActions;
    }

}

FluxComponent.contextTypes = {
    flux: PropTypes.instanceOf(Flux),
};

FluxComponent.childContextTypes = {
    flux: PropTypes.instanceOf(Flux),
};

FluxComponent.propTypes = {
    stores: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.object
    ]),
    actions: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.object
    ]),
    flux: PropTypes.instanceOf(Flux),
    stateGetter: React.PropTypes.func,
    actionsGetter: React.PropTypes.func,
};


function createStoreListener(component, store, storeStateGetter) {
    return function() {
        let state = storeStateGetter(store, this.props);
        this.setState(state);
    }.bind(component);
}

function createGetter(value, defaultGetter) {
    if (typeof value !== 'function') {
        return defaultGetter;
    } else {
        return value;
    }
}

function defaultStateGetter(store) {
    return store.getStateAsObject();
}

function defaultReduceStateGetter(stores) {
    return stores.reduce((result, store) => {
        assign(result, store.getStateAsObject());
    }, {});
}

function defaultActionGetter(actions) {
    return actions;
}

function defaultReduceActionGetter(actions) {
    return actions.reduce((result, _actions) => {
        assign(result, _actions.getStateAsObject());
    }, {});
}

export default FluxComponent;