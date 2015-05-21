import EventEmitter from 'eventemitter3';

/**
 * @class Actions
 * @extends EventEmitter
 */
export default class Actions extends EventEmitter {

    /**
     * Emit an event
     * @param  {String}    event [description]
     * @param  {...mixed}  args
     * @return {void}
     */
    emit(event, ...args) {
        if(typeof this[event] !== 'function') {
            console.warn(
                `${this.constructor.name} emitted \`${event}\`. ` + 
                `This action is not implemented and can therefore not be dispatched.`
            );
        }

        return super.emit(event, ...args);
    }

    /**
     * Dispatch an action
     * @param  {String}    action
     * @param  {...mixed}  args
     * @return {void}
     */
    dispatch(...args) {
        return this.emit(...args);
    }
}