import uniqueid from 'uniqueid';
import Store from '../../../../src/Store';
import flux from '../flux';

export default class TodoStore extends Store {

    constructor(flux) {
        var todoActions = flux.getActions('todos');
        
        todoActions.addListener('fetchWait', this.onFetchWait.bind(this));
        todoActions.addListener('fetchCompleted', this.onFetchCompleted.bind(this));
        todoActions.addListener('fetchFailed', this.onFetchFailed.bind(this));

        todoActions.addListener('create', this.onCreate.bind(this));
        todoActions.addListener('destroy', this.onDestroy.bind(this));

        this.setState({
            todos: []
        })
    }

    onFetchWait() {
        this.setState({
            waiting: true
        });
    }

    onFetchCompleted(todos) {
        this.setState({
            todos: todos, 
            waiting: undefined,
            error: undefined
        });
    }

    onFetchFailed(err) {
        this.setState({
            waiting: undefined, 
            error: err
        });
    }

    onCreate(title) {
        var todos = this.getState().todos;
        todos.push({id: uniqueid(), title: title});
        this.setState({todos: todos});
    }

    onDestroy(id) {
        var todos = this.getState().todos;
        var todo = todos.filter((t) => t.id == id).shift();
        var idx = todos.indexOf(todo);
        if (idx > -1) todos.splice(idx, 1);
        this.setState({todos: todos});
    }

}