"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Flux = (function () {
    function Flux(options) {
        _classCallCheck(this, Flux);

        this.actions = this.createActions(options.actions);
        this.stores = this.createStores(options.stores);
    }

    _prototypeProperties(Flux, null, {
        createActions: {
            value: function createActions(actions) {
                for (var key in actions) {
                    actions[key] = new actions[key](this);
                }return actions;
            },
            writable: true,
            configurable: true
        },
        createStores: {
            value: function createStores(stores) {
                for (var key in stores) {
                    stores[key] = new stores[key](this);
                }return stores;
            },
            writable: true,
            configurable: true
        },
        getActions: {
            value: function getActions(key) {
                return this.actions[key];
            },
            writable: true,
            configurable: true
        },
        getStore: {
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