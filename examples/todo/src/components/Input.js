import React from 'react';

class Input extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: ''};
    }

    onInputChange(event) {
        this.setState({value: event.target.value});
    }

    onClickCreate() {
        this.props.onClickCreate(this.state.value);
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


Input.propTypes = {
    onClickCreate: React.PropTypes.func
};

export default Input;