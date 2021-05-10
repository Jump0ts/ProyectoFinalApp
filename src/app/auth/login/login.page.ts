import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from "firebase/app";

import { Router } from '@angular/router';


import { AppComponent } from 'src/app/app.component';
import { ControladorService } from 'src/app/services/controlador.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  correo: string;
  contrasena: string;
  error:boolean = false;
  recuerda:boolean = false;

  constructor(private afAuth: AngularFireAuth,
    private router: Router,
    private controlador: ControladorService,
    private inicio: AppComponent,
    ) {  }

  ngOnInit() {
    this.afAuth.authState.subscribe((user)=>{
      if(user != null){
        this.router.navigate(['/recetas']); 
      }
    });
  }

  login(){
    
      this.error = false;
      if(this.recuerda == false){
        this.afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
      }
      else{
        this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      }
      this.afAuth.signInWithEmailAndPassword(this.correo, this.contrasena).catch(response => {
        this.error = true;
      }).finally(()=>{
        this.controlador.login(this.correo);
        this.cargarbarra();
        this.router.navigate(['/recetas']);
      });
        
  }
      
    
  
    
    register(){
      this.router.navigate(['/register']);
    }
  
  cargarbarra(){
    this.inicio.setLogged(true);
    this.inicio.setNombre(this.correo);
    
  }
    
}

