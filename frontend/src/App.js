import React, { Component } from 'react';
import './css/App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Error from './Error';
import Home from './Home';
/** 
	El componente Ruta es quizás el componente más importante en React Router. Su trabajo es representar una 
	interfaz de usuario cuando su ruta coincide con la URL actual.
**/
function App () {
  return (
    <div className='App'>
        <BrowserRouter>
			<header id='header'>
				<div className='center'>
				  <div id='logo'>
					<p><b>SDF Parser</b></p>      
				  </div>
				  <div className='clearfix'> </div>
				</div>
			</header>
			
			<Switch>
			  <Route exact path='/' component={Home} />
			  <Route exact path='/home' component={Home} />
			  <Route component={Error} />
			</Switch>
        <div className='clearfix'> </div>
		
      </BrowserRouter>
    </div>
  )
}

export default App
