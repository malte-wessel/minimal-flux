import React from 'react';
import flux from '../flux';
import Input from './Input';

let todoActions = flux.actions.todos;
let todoStore = flux.stores.todos;

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.setState = this.setState.bind(this);
        this.state = todoStore.getState();
    }

    componentDidMount() {
        todoStore.addListener('change', this.setState);
        todoStore.addListener('change', (s) => console.log(s));
        todoActions.fetch();
    }

    componentWillUnmount() {
        todoStore.removeListener('change', this.setState);
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