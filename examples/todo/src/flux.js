import Flux from './../../../src/Flux';
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