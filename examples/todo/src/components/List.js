import React from 'react';

class List extends React.Component {
    render() {
        var items = this.props.todos.map((todo) => {
            return (
                <li key={todo.id}>
                    {todo.title}
                    {' '}
                    <button onClick={this.props.onClickDone.bind(this, todo.id)}>Done</button>
                </li>
            );
        });

        return this.props.waiting ? <p>Loading...</p> : <ul>{items}</ul>;
    }
}

List.propTypes = {
    todos: React.PropTypes.arrayOf(React.PropTypes.object),
    onClickDone: React.PropTypes.func
};

export default List;