import uniqueid from 'uniqueid';
import Store from '../../../../src/Store';

export default class TodoStore extends Store {

    constructor() {
        this.handleAction('todos.fetch', this.handleFetch);
        this.handleAction('todos.fetchSuccess', this.handleFetchSuccess);
        this.handleAction('todos.fetchError', this.handleFetchError);
        this.handleAction('todos.create', this.handleCreate);
        this.handleAction('todos.destroy', this.handleDestroy);

        this.setState({todos: []});
    }

    handleFetch() {
        this.setState({
            waiting: true
        });
    }

    handleFetchSuccess(todos) {
        this.setState({
            todos: todos, 
            waiting: false,
            error: undefined
        });
    }

    handleFetchError(err) {
        this.setState({
            waiting: false, 
            error: err
        });
    }

    handleCreate(title) {
        var todos = this.getState().todos;
        todos.push({id: uniqueid(), title: title});
        this.setState({todos: todos});
    }

    handleDestroy(id) {
        var todos = this.getState().todos;
        var todo = todos.filter((t) => t.id == id).shift();
        var idx = todos.indexOf(todo);
        if (idx > -1) todos.splice(idx, 1);
        this.setState({todos: todos});
    }

}