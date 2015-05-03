import test from 'tape';
import hasPrefix from '../src/util/hasPrefix';

test('hasPrefix', (t) => {

    t.ok(hasPrefix('isFoo', 'is'),
        'camelcase');

    t.ok(hasPrefix('is', 'is'),
        'equals');

    t.notok(hasPrefix('isfoo', 'is'),
        'not camelcase');

    t.notOk(hasPrefix('foo', 'get'),
        'no match');

    t.end();

});