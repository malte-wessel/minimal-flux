minimal-flux
=========

A very lightweight implementation of Flux

[![Travis](https://img.shields.io/travis/malte-wessel/minimal-flux.svg?style=flat-square)](https://travis-ci.org/malte-wessel/minimal-flux)
[![David](https://img.shields.io/david/malte-wessel/minimal-flux.svg?style=flat-square)]()
[![NPM](https://img.shields.io/badge/NPM-minimal--flux-brightgreen.svg?style=flat-square)]()

## Install

````
npm install minimal-flux --save
````

## Features
* **Unidirectional data flow** implemented with the flux pattern
* **Minimal API**, lightweight implementation (~200 lines)
* **Idiomatic** Javascript (ready for use with ES6)
* Completely **synchronous**
* **Isolated** access
* **Easily testable**
* **No singletons**
* **Declarative** definition of **dependencies between stores**

[![Minimalflux](http://breakdesign.de/minimalflux.png)]()

## Examples

### The basics

````javascript
import React from 'react';
import { Actions, Store, Flux } from 'minimal-flux';

class MessageActions extends Actions {

    // Create an action...
    create(message) {
        this.emit('create', message);
    }
    
}

class MessageStore extends Store {

    constructor() {
        // Set initial state
        this.state = {messages: []};
        
        // Register an action handler
        this.handleAction('messages.create', this.handleCreate);
    }
    
    handleCreate(message) {
        let { messages } = this.getState();
        messages.push(message);
        
        // Update the store's state
        // `setState` will trigger a change event
        this.setState({ messages });
    }
    
}

// Create a new Flux instance and pass the actions and stores
let flux = new Flux({
    actions: {messages: MessagesActions},
    stores: {messages: MessagesStore},
});

// Use flux inside your components
class Messages extends React.Component {

    constructor() {
        this.setState = this.setState.bind(this);
        // Set the component's initial state.
        // Note: Inside your components, you only have access
        // to store functions that start with `get` or 
        // are inherited from EventEmitter
        this.state = flux.stores.messages.getState();
    }

    componentWillMount() {
        // Listen to changes in the store
        flux.stores.messages.addListener('change', this.setState);
    }

    componentWillUnmount() {
        // Stop listen to changes in the store
        flux.stores.messages.removeListener('change', this.setState);
    }

    render() {
        let messages = this.state.messages.map((message) => {
            return <li>{message}</li>;
        });
        return <ul>{messages}</ul>;
    }

}

````

### Fetching data

````javascript

class MessageActions extends Actions {

    fetch() {
        // Invoke wait action
        this.wait();
        // Make a request to your API
        request.get('/api/messages').end((err, res) => {
            // If we got an error invoke fail action
            if(err) return this.fail(err);
            // Otherwise invoke complete action
            this.complete(res.data);
        });
    }
    
    wait() {
        this.emit('wait');
    }
    
    complete(data) {
        this.emit('complete', data);
    }
    
    fail(err) {
        this.emit('fail', err);
    }
    
}

class MessageStore extends Store {
    constructor() {
        this.state = {messages: []};
        this.handleAction('messages.wait', this.handleWait);
        this.handleAction('messages.complete', this.handleComplete);
        this.handleAction('messages.fail', this.handleFail);
    }

    handleWait(message) {
        this.setState({
            waiting: true,
            error: undefined
        });
    }
    
    handleComplete(data) {
        this.setState({
            messages: data,
            waiting: false,
            error: undefined
        });
    }    
    
    handleFail(err) {
        this.setState({
            waiting: false,
            error: err
        });
    }
}


````

### Dependencies between stores

````javascript

class MessageActions extends Actions {
    receive(message) {
        this.emit('receive', message);
    }
}

class MessageStore extends Store {
    constructor() {
        this.state = {messages: []};
        this.handleAction('messages.receive', this.handleReceive);
    }

    handleReceive(message) {
        let { messages } = this.getState();
        messages.push(message);
        this.setState({ messages });
    }
}

class UnreadStore extends Store {
    constructor() {
        this.state = {count: null};
        this.handleAction('messages.receive', this.handleReceive);
    }
    
    handleReceive(message) {
        let { messages } = this.stores.messages.getState();
        let count = 0;
        for(msg of messages) if(msg.unread) count++;
        this.setState({ count });
    }
}

let flux = new Flux({
    actions: {
        messages: MessagesActions
    },
    stores: {
        messages: MessagesStore,
        // Since UnreadStore depends on MessageStore, 
        // we need to make sure that the MessageStore handles
        // the action first. This can be done by defining dependencies:
        unread: [UnreadStore, 'messages']
    },
});
````


## More examples

You can find more examples in `examples/`. Run the following commands to make the examples work:

````bash
# Run install for minimal-flux in the root directory
npm install
# Change to one of the examples
cd examples/<example>
# Install and build the example
npm run install
npm run build
````

Then open the index.html in your browser.

## Documentation

Work in progess. Have a look at the examples & tests!

## Inspiration
* [Facebook Flux](https://github.com/facebook/flux)
* [Flummox](https://github.com/acdlite/flummox)
* [Reflux](https://github.com/spoike/refluxjs)

## License
MIT
