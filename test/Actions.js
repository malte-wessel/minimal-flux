import Actions from './../src/Actions';
import test from 'tape';

test('Actions() is extendable', function (t) {
    t.ok(typeof Actions == 'function', 'Action is a function');
    t.end();
});