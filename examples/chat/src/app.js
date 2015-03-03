import React from 'react';

import ChatApp from './components/ChatApp';
import ChatExampleData from './ChatExampleData';
import ChatWebAPIUtils from './utils/ChatWebAPIUtils';

window.React = React;

ChatExampleData.init(); // load example data into localstorage
ChatWebAPIUtils.getAllMessages();

React.render(<ChatApp/>, document.getElementById('react'));