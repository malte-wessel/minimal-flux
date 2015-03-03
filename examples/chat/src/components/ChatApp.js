import React from 'react';
import flux from '../flux';
import ThreadSection from './ThreadSection';
import MessageSection from './MessageSection';

class App extends React.Component {

    getChildContext() {
        return { flux: flux };
    }

    render() {
        return (
            <div className="chatapp">
                <ThreadSection />
                <MessageSection />
            </div>
        );
    }
}

App.childContextTypes = {
    flux: React.PropTypes.object.isRequired
};

export default App;