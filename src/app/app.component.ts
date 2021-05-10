import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ControladorService } from './services/controlador.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit{

  protected isLogged: boolean;
  protected nombre: String = "";

  

  constructor(protected controlador: ControladorService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public afAuth: AngularFireAuth
  ) {
    
    this.initializeApp();
    
    
  }
  ngOnInit(): void {
    this.afAuth.authState.subscribe((user)=>{
      if(user != null){
        this.controlador.login(user.email);
        this.isLogged = true;
        this.nombre = user.email;
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public setNombre(usuario){
    this.nombre = usuario;
  }

  public setLogged(bool){
    this.isLogged = bool;
  }

  protected logout(){
    
    this.afAuth.signOut();
    this.isLogged = false;
    this.nombre = "";
    this.router.navigate(["/recetas"]);
  }

}
