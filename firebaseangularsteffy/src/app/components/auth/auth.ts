import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  titulo='hola'
  autenticando = false
  mensajeError = " "
  

  private authService = inject (AuthService)
  private router = inject (Router)


  //funcion de autenticacion - asincrona 
  async iniciarSesionConGoogle(): Promise<void>{
    this.autenticando = true
    this.mensajeError = " "

    try {
    //implementacion al servicio
    // const usuario = await this.authService.iniciarSesionConGoogle() 
    const usuario = await this.authService.iniciarSesion()
    /*/
      //vamos a simular un usuario ya creado
      let usuario = null
      usuario = await new Promise ((resolve) => {
        setTimeout(()=> resolve({nombre: "usuario de prueba"}),1000)
    })/*/

      if (usuario) {
        await this.router.navigate(['/chat'])
      } else {
        this.mensajeError = "error al autenticar con google"
        console.error("error al autenticar en try")
      }

    } catch (error: any ) {

      if(error.code === 'auth/popup-closed-by-user') {
        console.error("error, cerraste la ventana emergente ")
      }if(error.code === 'auth/popup-blocked') {
        console.log ("error, el navegador bloqueo la ventana emergente")
      }
      else if(error.code === 'auth/network-request-failed') {
        confirm("error, fallo la red, revisa tu conexion a internet")
      }

    } finally {
      this.autenticando = false
    }
  }

    ngOnInit(){
    this.authService.estaAutenticado$.subscribe (autenticado =>{
       if (autenticado)
        this.router.navigate(['/chat'])
  })
    }
     

  }