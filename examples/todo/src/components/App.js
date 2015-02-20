import React from 'react';
import flux from '../flux';
import Input from './Input';

var todoActions = flux.getActions('todos');
var todoStore = flux.getStore('todos');

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = todoStore.getState();
    }

    componentDidMount() {
        todoStore.addListener('change', this.setState.bind(this));
        todoStore.addListener('change', (state) => console.log(state));

        todoActions.fetch();
    }

    componentWillUnmount() {
        // Change: this.setState.bind() will not be unbound
        todoStore.removeListener('change', this.setState.bind(this));
    }

    onClickDone(id) {
        todoActions.destroy(id);
    }

    render() {

        var items = this.state.todos.map((todo) => {
            return (
                <li key={todo.id}>
                    {todo.title}
                    {' '}
                    <button onClick={this.onClickDone.bind(this, todo.id)}>Done</button>
                </li>
            );
        });

        var todos = this.state.waiting ? <p>Loading...</p> : <ul>{items}</ul>;

        return (
            <div className="app">
                <h1>Todos</h1>
                <Input/>
                {todos}
            </div>
        );
    }
}