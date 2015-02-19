"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var EventEmitter = require("eventemitter3").EventEmitter;
var assign = _interopRequire(require("object-assign"));

var Store = (function (EventEmitter) {
    function Store() {
        _classCallCheck(this, Store);

        if (EventEmitter != null) {
            EventEmitter.apply(this, arguments);
        }
    }

    _inherits(Store, EventEmitter);

    _prototypeProperties(Store, null, {
        setState: {
            value: function setState(state) {
                if (!state) {
                    return;
                }if (!this.state) this.state = {};
                this.state = assign({}, this.state, state);
                this.emit("change", this.state);
            },
            writable: true,
            configurable: true
        },
        getState: {
            value: function getState() {
                return this.state || {};
            },
            writable: true,
            configurable: true
        }
    });

    return Store;
})(EventEmitter);

module.exports = Store;