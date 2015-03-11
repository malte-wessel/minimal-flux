import React from 'react';
import flux from '../flux';

var todoActions = flux.actions.todos;
var todoStore = flux.stores.todos;

export default class Input extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};
    }

    onInputChange(event) {
        this.setState({value: event.target.value});
    }

    onClickCreate() {
        todoActions.create(this.state.value);
        this.setState({value: ''});
    }

    render() {
        return (
            <div>
                <input type="text" value={this.state.value} onChange={this.onInputChange.bind(this)}/>
                <button onClick={this.onClickCreate.bind(this)}>Create</button>
            </div>
        );
    }

}