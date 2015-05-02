import assign from 'object-assign';

export default function extend(SuperClass, properties) {
    function SubClass() {
        SuperClass.call(this);
    }
    SubClass.prototype = Object.create(SuperClass.prototype);
    assign(SubClass.prototype, { constructor: SuperClass }, properties);
    return SubClass;
}