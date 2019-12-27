import React, { Component } from 'react';
import Enlace from './Variables'; //conectando con el backend...
import uuid from 'uuid';
import $ from 'jquery';

/**
	En esta clase podremos tratar y mostrar los resultados de los procesos indicados.
*/
class Resultados extends Component {

  url = Enlace.url;

  render () {

	// Analizamos la expresión con la que se envía el filtro
    let pattern = this.props.filtPattern;
    let filtroAtributo = [];
    let parsedF = this.props.parsedFile;
    for (let i=0; i<parsedF.length; ++i) {
      filtroAtributo.push({"Structure":parsedF[i]["Structure"]});
      const keys = Object.keys(parsedF[i]);
      for ( let j = 0; j<keys.length; ++j) {
        if (keys[j].toLowerCase().includes(pattern.toLowerCase())) {
          filtroAtributo[i][keys[j]] = parsedF[i][keys[j]]
        }
      }
    }

	// Analizamos el fichero subido y su estructura, imprimiendo esta en formato de lista
    if (filtroAtributo.length >= 1) {
      var detalleMolecula = filtroAtributo.map((article) => {
        return (
        <article className='article-item' key={article._id} id='article-template'>	
          <div className="container">
            <ul class="list-group">
              { Object.keys(article).map(element => {
                  return element !== "Structure" ?
                    <li key={uuid()} class="list-group-item"> <strong>{element}:</strong> {article[element]}</li>
                    : <span key={uuid()}></span>
                })
              }
            </ul>
          </div>
		  
          <div className="imageContainer">
            <img className="image-wrap" src={this.url +  article.Structure} alt="imagen" />
          </div>

          <div className='clearfix'></div>
        </article>
        )
      })
	  
	  // Mensaje de texto
      return (
        <div id='compounds'>
          <h1 className='subheader'> Resultado del análisis del fichero SDF </h1>
		  El archivo seleccionado contiene la siguiente información:
		  <br /><br />
          {detalleMolecula}
        </div>
      )
    } else {
	  // Mensaje de texto inicial
      return (
        <div id='compounds'>
		  <br />
          <h2 className='subheader'>Analizador visual de ficheros SDF</h2>
          <p>Seleccione un fichero SDF para procesarlo y ver sus componentes.</p>
        </div>
      )
    }
  }
}

export default Resultados;