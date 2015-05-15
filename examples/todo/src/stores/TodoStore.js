import uniqueid from 'uniqueid';
import Store from '../../../../src/Store';

export default class TodoStore extends Store {

    constructor() {
        super();
        this.handleAction('todos.wait', this.handleWait);
        this.handleAction('todos.completed', this.handleCompleted);
        this.handleAction('todos.failed', this.handleFailed);
        this.handleAction('todos.create', this.handleCreate);
        this.handleAction('todos.destroy', this.handleDestroy);

        this.setState({todos: []});
    }

    handleWait() {
        this.setState({
            waiting: true
        });
    }

    handleCompleted(todos) {
        this.setState({
            todos: todos, 
            waiting: undefined,
            error: undefined
        });
    }

    handleFailed(err) {
        this.setState({
            waiting: undefined, 
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
