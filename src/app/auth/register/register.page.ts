import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { ControladorService } from 'src/app/services/controlador.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  correo:string = "";
  contrasena:string ="";
  contrasenaRep: string;
  usuario:string = "";
  errorCor: boolean = false;
  errorContra: boolean = false;
  errorContraRep: boolean = false;
  errorEmpty: boolean = false;
  readonly fotoEmpty: string ="https://firebasestorage.googleapis.com/v0/b/recetario-3c20b.appspot.com/o/Imagen_perfil%2Fno-imagen-usuario.jpg?alt=media&token=422629e6-b6cd-484c-af86-286c908bf3e9"

  constructor(public afAuth: AngularFireAuth,
    private router: Router,
    private inicio: AppComponent,
    private controlador: ControladorService) { }

  ngOnInit() {
  }

  register(){
    if(this.correo != "" && this.usuario != ""){
      if(this.contrasena.length>=6){
        if(this.contrasena==this.contrasenaRep){
          this.errorContra = false;
          this.errorContraRep = false;
          this.errorCor = false;
            this.afAuth.createUserWithEmailAndPassword(this.correo,this.contrasena).catch(err =>{
              this.errorCor = true;
            }).then(success=>{
              if(this.errorCor == false){
                let cuenta = {
                  correo: this.correo,
                  admin: false,
                  foto: this.fotoEmpty,
                  usuario: this.usuario
                }
                this.controlador.insertCuenta(cuenta);
                this.router.navigate((['/login']));
              }
            });
          
          }
        else{
          this.errorContraRep = true;
          this.errorCor = false;
          this.errorContra = false;
        }
      }
      else{
        this.errorContraRep = false;
        this.errorContra = true;
        this.errorCor = false;

      }
    }
    else{
      this.errorContraRep = false;
      this.errorContra = false;
      this.errorCor = false;
      this.errorEmpty = true;
    }
  }
}
