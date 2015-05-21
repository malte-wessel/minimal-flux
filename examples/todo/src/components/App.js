import React from 'react';
import Input from './Input';
import List from './List';

import FluxComponent from '../../../../src/components/FluxComponent';

export default class App extends React.Component {
    render() {
        return (
            <div className="app">
                <h1>Todos</h1>
                <FluxComponent
                    actions={{todos: actions => ({ onClickCreate: actions.create })}}>
                    <Input/>
                </FluxComponent>
                <FluxComponent
                    stores={'todos'}
                    actions={{todos: actions => ({ onClickDone: actions.destroy })}}>
                	<List/>
                </FluxComponent>
            </div>
        );
    }
}