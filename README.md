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
* Unidirectional data flow implemented with the flux pattern
* Minimal API, lightweight implementation (~200 lines)
* Idiomatic Javascript (ready for use with ES6)
* Completely synchronous
* Isolated access
* Easily testable
* No singletons

[![Minimalflux](http://breakdesign.de/minimalflux.png)]()

## Example

````javascript
import React from 'react';
import { Actions, Store, Flux } from 'minimal-flux';

class MessageActions extends Actions {
    create(message) {
        this.emit('create', message);
    }
}

class MessageStore extends Store {
    constructor() {
        this.state = {messages: []};
        this.handleAction('messages.create', this.handleCreate);
    }

    handleCreate(message) {
        let { messages } = this.getState();
        messages.push(message);
        this.setState({ messages });
    }
}

let flux = new Flux({
    actions: {messages: MessagesActions},
    stores: {messages: MessagesStore},
});

class Messages extends React.Component {

    constructor() {
        this.setState = this.setState.bind(this);
        this.state = flux.store.messages.getState();
    }

    componentWillMount() {
        flux.stores.messages.addListener('change', this.setState);
    }

    componentWillUnmount() {
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

Work in progess. Have a look at the examples & tests!


## Examples

You can find some examples in `examples/`. Run the following commands in the `examples/<example>/` directory:

````
npm install
npm run build
````

Then open index.html in your browser.
