import React from 'react';
import ReactDOM from "react-dom";
import Layout from "./Layout";
import registerServiceWorker from './registerServiceWorker';

class App extends React.Component {
  render(){
    return (
        <div id="app-contanier">
            <Layout ava="man.ico"/>
       </div>
    )}
}
ReactDOM.render(
	<App />,
	 document.getElementById('root')
);

registerServiceWorker();
