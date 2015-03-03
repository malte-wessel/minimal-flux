import Flux from '../../../src/Flux';

import ServerActions from './actions/ServerActions';
import ThreadActions from './actions/ThreadActions';
import MessageActions from './actions/MessageActions';

import ThreadStore from './stores/ThreadStore';
import MessageStore from './stores/MessageStore';
import UnreadStore from './stores/UnreadStore';

export default new Flux({

    actions: {
    	server: ServerActions,
    	threads: ThreadActions,
        messages: MessageActions
    },

    stores: {
        threads: ThreadStore,
        messages: [MessageStore, 'threads'],
        unread: [UnreadStore, 'threads', 'messages']
    }

});