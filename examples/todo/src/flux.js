import { Flux } from 'minimal-flux';
import TodoActions from './actions/TodoActions';
import TodoStore from './stores/TodoStore';

export default new Flux({

    actions: {
        todos: TodoActions
    },

    stores: {
        todos: TodoStore
    }

});