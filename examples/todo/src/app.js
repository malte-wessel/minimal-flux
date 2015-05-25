import React from 'react';
import App from './components/App';

import flux from './flux';
import FluxComponent from '../../../src/components/FluxComponent';

// Log dispatches
flux.addListener('dispatch', (...args) => {
	console.info('dispatch', ...args);
});

flux.actions.todos.fetch();

React.render(
	<FluxComponent flux={ flux }><App/></FluxComponent>, 
	document.getElementById('main')
);