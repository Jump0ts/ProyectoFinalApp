import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Receta } from '../class/receta';
import { ControladorService } from '../services/controlador.service';

@Component({
  selector: 'app-semana',
  templateUrl: './semana.page.html',
  styleUrls: ['./semana.page.scss'],
})
export class SemanaPage implements OnInit {

  protected lunes: Receta[]=[];
  protected martes: Receta[]=[];
  protected miercoles: Receta[]=[];
  protected jueves: Receta[]=[];
  protected viernes: Receta[]=[];
  protected sabado: Receta[]=[];
  protected domingo: Receta[]=[];

  constructor(protected controlador: ControladorService, private afAuth: AngularFireAuth, private router: Router, private alertController: AlertController) { 
    
  }

  

  ngOnInit() {
    
    console.log(this.lunes);
    

    this.afAuth.authState.subscribe((user)=>{
      if(user == null){
        this.router.navigate(['/login']); 
      }
    });

    if(this.controlador.getUsuario().semana.size==0){
      this.router.navigate(['/recetas']); 
      //location.reload();
    }

    this.lunes = [];
    this.martes = [];
    this.miercoles = [];
    this.jueves = [];
    this.viernes = [];
    this.sabado = [];
    this.domingo = [];

    this.rellenaArray("lunes", this.lunes);
    this.rellenaArray("martes", this.martes);
    this.rellenaArray("miercoles", this.miercoles);
    this.rellenaArray("jueves", this.jueves);
    this.rellenaArray("viernes", this.viernes);
    this.rellenaArray("sabado", this.sabado);
    this.rellenaArray("domingo", this.domingo);
  }

  

  ionViewWillEnter(){

    this.lunes = [];
    this.martes = [];
    this.miercoles = [];
    this.jueves = [];
    this.viernes = [];
    this.sabado = [];
    this.domingo = [];

    this.rellenaArray("lunes", this.lunes);
    this.rellenaArray("martes", this.martes);
    this.rellenaArray("miercoles", this.miercoles);
    this.rellenaArray("jueves", this.jueves);
    this.rellenaArray("viernes", this.viernes);
    this.rellenaArray("sabado", this.sabado);
    this.rellenaArray("domingo", this.domingo);
    
  }

  private rellenaArray(dia: string, arrayDia: Receta[]){
    for(let i = 0; i<this.controlador.getUsuario().semana.get(dia).length;i++){
      if(this.controlador.getUsuario().semana.get(dia)[i]==undefined){
        arrayDia.push(new Receta("","No hay receta añadida",[],"",[],true,[],"","../../../assets/icon/sin-foto-comida.png"));
      }
      else{
        arrayDia.push(this.controlador.getUsuario().semana.get(dia)[i]);
      }
    }
  }

  protected pinchaReceta(id:string){
    if(id!="")this.router.navigate(['/receta/'+id]);
    else this.alerta();
  }

  protected async alerta(){
    const alert = await this.alertController.create({
      message: 'No tiene ninguna receta añadida a la que ir.',
      buttons: ['Vale']
    });

    await alert.present();
  }
}
