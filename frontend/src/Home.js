import React, { Component } from 'react';
import Opciones from './Opciones';
import Resultados from './Resultados';
import Enlace from './Variables'; //conectando con el backend...

/**
	Clase que nos permite gestionar y mostrar los diferentes componentes de nuestra página principal
*/
class Home extends Component {
	
  url = Enlace.url

  state = {
    parsedFile: [],
    filtPattern: '',
    requestStatus: null
  }

  // Obtenemos el fichero cargado
  loadedFile = (parsedF, requestStatus) => {
    this.setState({
      parsedFile: parsedF,
      requestStatus: requestStatus
    });
  }

  // Obtenemos el patrón proporcionado por el usuario por el cual se realizará el filtrado
  filterPattern = (pattern) => {
    this.setState({
      filtPattern: pattern
    });
  }

  render () {
	// Mostramos los módulos presentes   
    return (
      <div id='home'>
	    <div id='slider' className='slider-small'></div>

        <div className='center'>
          <div id='content'>

          <Opciones
            loadedFile = {this.loadedFile}
            filterPattern = {this.filterPattern}
          />
		  
            <Resultados
              parsedFile={this.state.parsedFile}
              filtPattern = {this.state.filtPattern}
              status = {this.state.requestStatus}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Home