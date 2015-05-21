import React from 'react';
import App from './components/App';

import flux from './flux';
import FluxComponent from '../../../src/components/FluxComponent';

// Catch errors from Promises
flux.addListener('error', (err) => {
	setTimeout(() => { throw err; });
});

// Log dispatches
flux.addListener('dispatch', (...args) => {
	console.info('dispatch', ...args);
});

flux.actions.todos.fetch();

React.render(
	<FluxComponent flux={ flux }><App/></FluxComponent>, 
	document.getElementById('main')
);