import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ControladorService } from '../services/controlador.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  protected img: string ="";
  protected imgAux: string ="";
  protected imgCambioImg: string ="../../../assets/icon/cambiar-imagen-perfil.png";
  protected user: string;
  protected cambioImg: boolean = false;
  protected cambio: boolean = false;
  protected url: string;
  protected file: File;
  @Output() onChange: EventEmitter<File> = new EventEmitter<File>();

  constructor(protected controlador: ControladorService, private afAuth: AngularFireAuth, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    this.afAuth.authState.subscribe((user)=>{
      if(user == null){
        this.router.navigate(['/login']); 
      }
    });
    this.img = this.controlador.getUsuario().foto;
    
    if(this.img==""){
      this.router.navigate(['/recetas']); 
    }
    
  }

  ionViewWillEnter(){
    this.afAuth.authState.subscribe((user)=>{
      if(user == null){
        this.router.navigate(['/login']); 
      }
    });
    this.img = this.controlador.getUsuario().foto;
    this.user = this.controlador.getUsuario().usuario;
  }

  protected guardarCambios(){
    if(this.cambioImg==false && this.cambio==true){
      this.controlador.cambiaConfigNombre(this.user);
    }
    else if(this.cambioImg==true){
      this.controlador.cambiaConfig(this.user, this.file);
    }

    this.changeSuccess();
    this.cambio=false;
    this.cambioImg=false;
    
  }

  protected punteroEncima(){
    this.imgAux=this.img;
    this.img=this.imgCambioImg;
  }

  protected punteroSale(){
    this.img=this.imgAux;
  }

  protected detectarArchivo(event){
    let reader = new FileReader;
    this.file = event.target.files[0];


    reader.onload = (e: any)=>{
      if(e.target.result.indexOf("image")!=-1){
        this.cambioImg = true;
        this.img = e.target.result;
        this.imgAux= e.target.result;
        this.onChange.emit(this.file);
      }
      else{
        this.img = this.controlador.getUsuario().foto;
        this.cambioImg = false;
        this.file = null;
        this.errorImagen();
      }
    }
    if(this.file!=null)reader.readAsDataURL(this.file);
  }

  private async errorImagen(){
    const alert = await this.alertController.create({
      animated: true,
      cssClass: 'alerta',
      message: 'El archivo escogido no es una imagen, inténtelo de nuevo seleccionando una imagen.',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  protected cambioTexto(){
    if(this.user!=this.controlador.getUsuario().usuario)this.cambio = true;
    else this.cambio=false;
  }

  private async changeSuccess(){
    const alert = await this.alertController.create({
      animated: true,
      cssClass: 'alerta',
      header: 'Cambios realizados correctamente.',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  protected async changePassword(){
    //Creamos la alert que hay que rellenar para el cambio de contraseña
    const alert = await this.alertController.create({
      header: 'Cambiar contraseña',
      inputs: [
        {
          name: 'oldPassword',
          placeholder: 'Antigua contraseña...',
          type: 'password'
        },
        {
          name: 'newPassword',
          placeholder: 'Nueva contraseña...',
          type: 'password'
        },
        {
          name: 'newPasswordConfirm',
          placeholder: 'Confirma la nueva contraseña...',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
         {
          text: 'Cambiar contraseña',
          handler: data => {
            //Cogemos el usuario logeado en ese momento
            const cpUser = firebase.auth().currentUser; 

            /*Cogemos las credenciales del usuario que está iniciado.*/

            const credentials = firebase.auth.EmailAuthProvider.credential(
              cpUser.email, data.oldPassword);

              //Volvemos a iniciar sesión
              cpUser.reauthenticateWithCredential(credentials).then(
                success => {
                  if(data.newPassword != data.newPasswordConfirm){
                    this.simpleAlert('Cambio de contraseña fallida.','La contraseña nueva no ha sido confirmada.','Intentar de nuevo' );
                  } else if(data.newPassword.length < 6){
                    this.simpleAlert('Cambio de contraseña fallida.','La contraseña debe tener al menos 6 caracteres.','Intentar de nuevo' );
                  } else {
                    this.simpleAlert('Cambio de contraseña correcto.','Tu contraseña se ha actualizado con éxito.','Aceptar');
                  /* Update contraseña */
                  cpUser.updatePassword(data.newPassword).then(function(){
                    //Success
                  }).catch(function(error){
                    //Failed
                  });
                  }
                },
                error => {
                  console.log(error);
                  if(error.code === "auth/wrong-password"){
                    this.simpleAlert('Cambio de contraseña fallida.','La contraseña antigua es incorrecta.','Intentar de nuevo' );
                  }
                }
              )
              console.log(credentials); 
            }
          }
      ]
    });
    alert.present();
  }

  protected async changeEmail(){
    //Creamos la alert que hay que rellenar para el cambio de contraseña
    const alert = await this.alertController.create({
      header: 'Cambiar correo eletrónico.',
      inputs: [
        {
          name: 'password',
          placeholder: 'Introduzca la contraseña...',
          type: 'password'
        },
        {
          name: 'newEmail',
          placeholder: 'Nuevo correo...',
          type: 'text'
        },
        {
          name: 'newEmailConfirm',
          placeholder: 'Confirma el nuevo correo...',
          type: 'text'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
         {
          text: 'Cambiar Email.',
          handler: data => {
            //Cogemos el usuario logeado en ese momento
            const cpUser = firebase.auth().currentUser; 

            /*Cogemos las credenciales del usuario que está iniciado.*/

            const credentials = firebase.auth.EmailAuthProvider.credential(
              cpUser.email, data.password);

              
              //Volvemos a iniciar sesión
              cpUser.reauthenticateWithCredential(credentials).then(
                success => {
                  if(data.newEmail != data.newEmailConfirm){
                    this.simpleAlert('Cambio de email fallido.','El email nuevo no ha sido confirmado.','Intentar de nuevo' );
                  } else {
                    
                  /* Update contraseña */
                  cpUser.updateEmail(data.newEmail).then(async function(){
                    //Success
                    let alertController = new AlertController();
                    const alert = await alertController.create({
                      header: 'Cambio de email correcto.',
                      message: 'Tu email se ha actualizado con éxito.',
                      buttons: ['Aceptar']
                    });
                    await alert.present();
                  }).catch(async function(error){
                    //Failed
                    let alertController = new AlertController();
                    console.log(error);
                    if(error.code==="auth/email-already-in-use"){
                      const alert = await alertController.create({
                        header: 'Cambio de email fallido.',
                        message: 'El email indicado ya está en uso.',
                        buttons: ['Intentar de nuevo']
                      });
                      await alert.present();
                    }
                    
                  });
                  }
                },
                error => {
                  //console.log(error);
                  if(error.code === "auth/wrong-password"){
                    this.simpleAlert('Cambio de email fallido.','La contraseña es incorrecta.','Intentar de nuevo' );
                  }
                });
              }
         }]
        });
              
   
    alert.present();
  }

  protected async simpleAlert(header: string, message: string, button: string){
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [button]
    });
    await alert.present();
  }
}
