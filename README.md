minimal-flux
=========

## Important: This Project is abandoned
This project is abandoned, use [Redux](https://github.com/rackt/redux) instead.

A lightweight implementation of Flux

[![Travis](https://img.shields.io/travis/malte-wessel/minimal-flux.svg?style=flat-square)](https://travis-ci.org/malte-wessel/minimal-flux)
[![David](https://img.shields.io/david/malte-wessel/minimal-flux.svg?style=flat-square)]()
[![NPM](https://img.shields.io/badge/NPM-minimal--flux-brightgreen.svg?style=flat-square)]()

* [Features](#features)
* [The basics](#the-basics)
* [Documentation](#documentation)
    * [Core concepts](#core-concepts)
    * [API](#api)
* [Advanced patterns](#advanced-patterns)
* [Examples](#examples)
* [Boilerplates](#boilerplates)

## Install

````
npm install minimal-flux --save
````

## Features
* **Unidirectional data flow** implemented with the flux pattern
* **Minimal API**, lightweight implementation (~200 lines)
* **Isolated** stores
* **Idiomatic** Javascript (ready for use with ES6)
* **Completely synchronous**
* **Easily testable**
* **No singletons**
* **Declarative** definition of **dependencies between stores**

## The basics

There are plenty of flux libraries out there that try to solve different things. This one is about **minimalism**, **convenience** and **isolation** while following the ideas behind flux. As in the [original flux implementation](https://github.com/facebook/flux) the main actors are *Components*, *Actions* and *Stores*. Have a look at the following graph:

[![Minimalflux](http://breakdesign.de/minimalflux.png)]()

Here you can see how the flux loop works:

1. Components invoke actions
2. Store listen to actions and can update their state
3. Components listen to store updates and rerender if something changes

What about the dispatcher? Minimal-flux implements an own dispatcher under the hood - you don't have to worry about those details, just invoke actions and you're good :) Let's have a look at some code!

### Actions

````javascript
import { Actions } from 'minimal-flux';

export default class MessageActions extends Actions {

    // Create an action...
    create(message) {
        this.dispatch('create', message);
    }
    
}

````

### Stores

````javascript
import { Store } from 'minimal-flux';

export default class MessageStore extends Store {

    constructor() {
        super();
        // Set initial state
        this.state = { messages: [] };
        
        // Register a handler for the create action
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
````

### Components

````javascript
import { Flux } from 'minimal-flux';
import MessageActions from './MessageActions';
import MessageStore from './MessageStore';

// Create a new Flux instance and pass the actions and stores.
// You can of course put this into an own file and require it inside your
// components or just pass it down the components tree via context.
let flux = new Flux({
    actions: { messages: MessageActions },
    stores: { messages: MessageStore },
});

// Use flux inside your components
export default class Messages extends React.Component {

    constructor(props, context) {
        super(props, context)
        this.setState = this.setState.bind(this);

        // Set the component's initial state.
        // Note: Inside your components, you only have access to store 
        // functions that start with `get` or are inherited from EventEmitter
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

## Documentation

### Core concepts

#### Isolation

A lot of problems that people have with flux is that they don't know where to put things and which actor is allowed to perform which operation. Minimal-flux isolates stores and actions, so that you are forced to follow the flux pattern.

Here are the rules :)

##### Stores can only be updated by themselves
You can only access your stores through the flux object. When your stores are instantiated they get wrapped by an object that **only exposes getters (methods that start with `get`) and an API for registering events** (stores extend [eventemitter3](https://github.com/primus/eventemitter3)). Therefore you have no chance to update your stores from the outside:

````javascript
// ReferenceError: setState is not defined
flux.stores.todos.setState({ foo: 'bar' })

// Getting the state works
let state = flux.stores.todos.getState()

// Registering events also
flux.stores.todos.addListener('change', handler);
````

##### Stores can get data from other stores
Inside your stores you have access to all other registered stores. Same as before: you cannot update stores from other stores.

````javascript
class ThreadStore extends Store {
    handleCreateMessage() {
        // This does work
        let messages = this.stores.messages.getState();

        // ReferenceError: setState is not defined
        this.stores.message.setState({ messages: [] })
    }
}
````

##### Stores can listen to actions
Stores listen to actions and update their state:

````javascript
class MessageStore extends Store {
    constructor() {
        this.handleAction('messages.create', this.handleMessagesCreate)
    }
}
````

##### Stores cannot invoke actions
Invoking actions from within stores is a bad idea. You could easily get into a race condition and break the unidrectional data flow. If you want read more about this [have a look here](https://github.com/facebook/flux/issues/47#issuecomment-54716863)

````javascript
class ThreadStore extends Store {
    handleCreateMessage(message) {
        // ReferenceError: actions is not defined
        this.actions.message.markAsRead(message.id)
    }
}
````

##### Actions can invoke other actions

````javascript
class MessageActions extend Actions {
    fetch() {
        API.fetch().then(this.complete).catch(this.fail);
    }
    complete(data) {
        this.dispatch('complete', data);
    }
    fail(error) {
        this.dispatch('fail', error);
    }
}
````

### API

#### Flux

##### `Flux(options)`

* `options` {Object}
* `options.actions` {Object} Namespaced actions
* `options.stores` {Object} Namespaced stores

Creates a new flux instance.

##### Example
````javascript
import { Flux } from 'minimal-flux';
import MessageActions from './MessageActions';
import MessageStore from './MessageStore';

// Create a new Flux instance and pass the actions and stores.
// You can of course put this into an own file and require it inside your
// components or just pass it down the components tree via context.
let flux = new Flux({
    actions: {
        messages: MessageActions
    },
    stores: {
        messages: MessageStore
    }
});
````

#### Actions

##### `Action.dispatch(name, ...args)`

* `name` {String} The name of the action method

Dispatch the action

###### Example
````javascript
class MessageActions extends Actions {
    create(message) {
        this.dispatch('create', message);
    }
}
````

#### Stores

Stores should only be instantiated through the [flux object](#flux). When your stores are instantiated they get wrapped by an object that **only exposes getters (methods that start with `get`) and an API for registering events** (stores extend [eventemitter3](https://github.com/primus/eventemitter3)).

##### `Store.handleAction(id, handler)`

* `id` {String} The id of the action to be handled.
* `handler` {Function} Function that will be invoked when the action is dispatched

Register an action handler. The action id is composed of the key you registered your Action class with and the name of the action method (e.g. `messages.create`). The handler will be bound automatically bound to the store instance. 

###### Example
````javascript
class MessageStore extends Store {

    constructor() {
        this.handleAction('messages.create', this.handleCreate);
    }
    
    handleCreate(message) {
        // Do stuff
    }
}
````

*This method is only available inside of stores.*

##### `Store.stopHandleAction(id)`

* `id` {String} The id of the action

Unregister an action handler.

*This method is only available inside of stores.*

##### `Store.addListener(event, handler)`

* `event` {String} The name of the event.
* `handler` {Function}

Add an event listener. Stores emit a `change` event when `setState` is called.

##### `Store.removeListener(event, handler`

* `event` {String} The name of the event.
* `handler` {Function}

Remove an event listener.

##### `Store.setState(state, options)`

* `state` {Object} An object containing the state
* `options` {Object}
* `options.silent` {Boolean} If true, change event will not be emitted

Set the store's state and emit a `change` event. Note: This will extend the current state with the passed state object.

[**This method is only available inside of stores.**](#stores-can-only-be-updated-by-themselves)

##### `Store.getState()`

Get the store's current state.

## Advanced patterns

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
        this.dispatch('wait');
    }
    
    complete(data) {
        this.dispatch('complete', data);
    }
    
    fail(err) {
        this.dispatch('fail', err);
    }
    
}

class MessageStore extends Store {
    constructor() {
        this.state = { messages: [] };
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
        this.dispatch('receive', message);
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
        messages: MessageActions
    },
    stores: {
        messages: MessageStore,
        // Since UnreadStore depends on MessageStore, 
        // we need to make sure that the MessageStore handles
        // the action first. This can be done by defining dependencies:
        unread: [UnreadStore, 'messages']
    },
});
````

## Examples

You can find more examples in `examples/`. Run the following commands to make the examples work:

````bash
# Run install for minimal-flux in the root directory
npm install
# Change to one of the examples
cd examples/<example>
# Install and build the example
npm install
npm run build
````

Then open the index.html in your browser.

## Boilerplates

* [mbrio/react-boilerplate](https://github.com/mbrio/react-boilerplate/tree/react-0.13-minimal-flux) Thanks to @mbrio


## Inspiration
* [Facebook Flux](https://github.com/facebook/flux)
* [Flummox](https://github.com/acdlite/flummox)
* [Reflux](https://github.com/spoike/refluxjs)

## License
MIT
