import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Enlace from './Variables'; //conectando con el backend...

// Embellecemos el cuadro de diálogo
import swal from 'sweetalert';
import LoadingGif from './loading.gif';

class Opciones extends Component {
  url = Enlace.url;
  parser = Enlace.parser;
  filtroAtributo = React.createRef();

  state = {
    search: '',
    redirect: false,
    selectedFile: null,
    selectedFileName: '',
    filterPattern: ''
  }
  
  // Al filtrar por atributo sobre el presente fichero
  redirectToSearch = (e) => {
    e.preventDefault();
	// filterPattern nos indica el atributo en cuestión
    this.props.filterPattern(this.filtroAtributo.current.value);
  }

  // Subimos un fichero para analizar
  uploadFile = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      selectedFileName: event.target.files[0].name
    })
  }

  // Mensaje para embellecer la espera 
  parsingRequest = (event) => {
    swal({
        title: "Analizando...",
        text: "",
        icon: LoadingGif,
        buttons: false
    });

	// Tratamos el fichero según el tratamiento que en el backend se da de él
    const data = new FormData();
    data.append('file', event.target.files[0]);
    axios
      .post(this.url + this.parser, data, {
        headers: {'content-type': 'multipart/form-data'}
      })
      .then(res => {
        swal.close();
        this.props.loadedFile(res.data, 'success');
      })
      .catch(e => {
        alert(e);
      });
  }

  // Actualizamos frente a la subida de un fichero
  onChangeHandler = event => {
    this.uploadFile(event);
    this.parsingRequest(event);
    event.target.value = null; 
  }

  render () {
    if (this.state.redirect) {
      return (
        <Redirect to={'/redirect/'+this.state.search} />
      )
    }

	// Cuadro con los componentes disponibles en la web
    return (
      <aside id='sidebar'>
		  <table>
			<tr>
				<td>
					<div id='nav-blog' className='sidebar-item'>
					  <h3>Seleccione un archivo (.SDF)</h3>
					  <table>
						<tr>
							<td>
								<input readOnly type="text" value = {this.state.selectedFileName}/>
								<input type="file" name="file" id="file" className="inputfile" onChange={this.onChangeHandler} />	  
							</td>
							<td>
								<label htmlFor="file" className='btn btn-primary'>Buscar</label>
							</td>
						</tr>		
					  </table>
					</div>						
				</td>
				<td>				
					<div id='search' className='sidebar-item'>
					  <h3>Filtrar por un atributo visible</h3>  
					  <form onSubmit= {this.redirectToSearch}>
						  <table>
							<tr>
								<td>
									<input type='text' name='search' ref={this.filtroAtributo}/>
								</td>
								<td>
									<input type='submit' name='submit' value='Filtrar' className='btn btn-primary' />
								</td>
							</tr>		
						  </table>	
					  </form>		  
					</div>
				</td>
			</tr>		
		  </table>	
			  
      </aside>
    )
  }
}

export default Opciones;