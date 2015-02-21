"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

function createNamespacedActions(actions) {
    for (var key in actions) {
        actions[key] = new actions[key]();
    }return actions;
}

function createNamespacedStores(stores) {
    for (var key in stores) {
        stores[key] = new stores[key]();
    }return stores;
}

function wrapNamespacedActions(actions) {
    var wrapped = {};
    for (var key in actions) {
        wrapped[key] = wrapActions(actions[key]);
    }return wrapped;
}

function wrapNamespacedActionsEmitter(actions) {
    var wrapped = {};
    for (var key in actions) {
        wrapped[key] = wrapActionsEmitter(actions[key]);
    }return wrapped;
}

function wrapNamespacedStores(store) {
    var wrapped = {};
    for (var key in store) {
        wrapped[key] = wrapStore(store[key]);
    }return wrapped;
}

function wrapActions(actions) {
    var wrapped = {};
    for (var _iterator = getMethodNames(actions.constructor.prototype)[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
        var method = _step.value;
        wrapped[method] = actions[method].bind(actions);
    }
    return wrapped;
}

function wrapActionsEmitter(actions) {
    return {
        addListener: actions.addListener.bind(actions),
        removeListener: actions.removeListener.bind(actions)
    };
}

function getMethodNames(instance) {
    return Object.getOwnPropertyNames(instance).filter(function (name) {
        return name !== "constructor" && typeof instance[name] === "function";
    });
}

function wrapStore(store) {
    return {
        addListener: store.addListener.bind(store),
        removeListener: store.removeListener.bind(store),
        getState: store.getState.bind(store)
    };
}

function invokeStoreDidMount(stores, wrappedActions, wrappedStores) {
    for (var key in stores) {
        var store = stores[key];
        if (typeof store.storeDidMount === "function") {
            store.storeDidMount.call(store, wrappedActions, wrappedStores);
        }
    }
    return stores;
}

var Flux = (function () {
    /**
     * Constructor
     * @param  {object} options containing the namespaced actions and stores
     * @return {Flux}
     */
    function Flux(options) {
        _classCallCheck(this, Flux);

        var actions = createNamespacedActions(options.actions);
        var stores = createNamespacedStores(options.stores);

        var wrappedActions = wrapNamespacedActions(actions);
        var wrappedStores = wrapNamespacedStores(stores);
        var actionEmitters = wrapNamespacedActionsEmitter(actions);

        this.actions = wrappedActions;
        this.stores = wrappedStores;

        invokeStoreDidMount(stores, actionEmitters, wrappedStores);
    }

    _prototypeProperties(Flux, null, {
        getActions: {

            /**
             * Get namespaced actions
             * @param  {String} key returns an action by key
             * @return {Action}
             */
            value: function getActions(key) {
                return this.actions[key];
            },
            writable: true,
            configurable: true
        },
        getStore: {


            /**
             * Get namespaced store
             * @param  {String} key returns a store by key
             * @return {Store}
             */
            value: function getStore(key) {
                return this.stores[key];
            },
            writable: true,
            configurable: true
        }
    });

    return Flux;
})();

module.exports = Flux;