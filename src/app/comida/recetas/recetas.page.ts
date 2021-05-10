import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { ControladorService } from 'src/app/services/controlador.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore' ;
import { app } from 'firebase';
import { Receta } from 'src/app/class/receta';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
})
export class RecetasPage implements OnInit {

  protected recetas: Receta[] = [];
  protected glutenFree: boolean = false;
  protected vegan: boolean = false;
  protected vegie: boolean = false;
  protected fishFree: boolean = false;
  protected sugarFree: boolean = false;
  protected saltFree: boolean = false;
  protected filtro: boolean = false;
  protected noVerificadas: boolean = false;
  protected favoritas: boolean = false;
  protected masTarde: boolean = false;
  protected todas: boolean = true;
  protected todoIniciado: boolean = true;
  protected nombre: string ="";
  
  constructor(public navCtrl: NavController, protected controlador: ControladorService, private afAuth: AngularFireAuth, private router: Router, private alertController: AlertController) { 
    
  }

  

  ngOnInit() {
    this.afAuth.authState.subscribe((user)=>{
      if(user == null){
        this.router.navigate(['/login']); 
      }
    });
  }

  ionViewWillEnter(){
    this.afAuth.authState.subscribe((user)=>{
      if(user == null){
        this.router.navigate(['/login']); 
      }
    });
    

    this.controlador.loadRecetas();
    this.recetas = this.controlador.getRecetas(true);

    if(this.todoIniciado=true && this.recetas.length!=0)this.buscar();
    this.todoIniciado=true;
    console.log(this.recetas.length!=0);
    
  }
  

  protected clickReceta(id){
    this.router.navigate(['/receta/'+id]);
  }

  protected buscar(){
    
    this.filtro = false;
    
    if(this.todas==true)this.copiarRecetas();
    else if(this.noVerificadas==true)this.mostrarNoVerificadas();
    else if(this.favoritas==true)this.mostrarFavoritas();
    else if(this.masTarde==true)this.mostrarMasTarde();

    
    if(this.vegan==true)this.isVegan();
    if(this.vegie==true)this.isVegie();
    if(this.fishFree==true)this.sinPescado();
    if(this.glutenFree==true)this.sinGluten();
    if(this.sugarFree==true)this.sinAzucar();
    if(this.saltFree==true)this.sinSal();
    if(this.nombre!="")this.buscarPorNombre();
    
    
  }
  
  private sinGluten(){
    this.filtro = true;
    for(let i = 0; i<this.recetas.length;i++){
        if(this.recetas[i].propiedades.indexOf("glutenFree")==-1){
          this.recetas.splice(i,1);
        }
    }
  }

  private sinAzucar(){
    this.filtro = true;
    
    for(let i = 0; i<this.recetas.length;i++){
      
        if(this.recetas[i].propiedades.indexOf("sugarFree")==-1){
          this.recetas.splice(i,1);
        }
      
    }
  }

  private sinSal(){
    this.filtro = true;
    
    for(let i = 0; i<this.recetas.length;i++){
      
        if(this.recetas[i].propiedades.indexOf("saltFree")==-1){
          this.recetas.splice(i,1);
        }
      
    }
  }

  private isVegan(){
    this.filtro = true;
    for(let i = 0; i<this.recetas.length;i++){
        if(this.recetas[i].propiedades.indexOf("vegan")==-1){
          this.recetas.splice(i,1);
        }
    }
  }

  private isVegie(){
    this.filtro = true;
    for(let i = 0; i<this.recetas.length;i++){
        if(this.recetas[i].propiedades.indexOf("vegie")==-1){
          this.recetas.splice(i,1);
        }
    }
  }

  private sinPescado(){
    this.filtro = true;
    for(let i = 0; i<this.recetas.length;i++){
        if(this.recetas[i].propiedades.indexOf("fishFree")){
          this.recetas.splice(i,1);
        }
    }
  }

  protected mostrarNoVerificadas(){
    this.recetas=[];

    this.noVerificadas = true;
    this.todas = false;
    this.favoritas = false;
    this.masTarde = false;

    this.controlador.getRecetas(false).forEach(receta=>{
      this.recetas.push(receta);
    });
  }

  protected mostrarFavoritas(){
    this.recetas=[];

    this.noVerificadas = false;
    this.todas = false;
    this.favoritas = true;
    this.masTarde = false;

    this.controlador.getUsuario().favoritas.forEach(receta=>{
      this.recetas.push(receta);
    });
  }

  protected mostrarMasTarde(){
    this.recetas=[];

    this.noVerificadas = false;
    this.todas = false;
    this.favoritas = false;
    this.masTarde = true;
    
    this.controlador.getUsuario().masTarde.forEach(receta=>{
      this.recetas.push(receta);
    });
  }

  private buscarPorNombre(){
    this.filtro = true;
    for(let i = 0; i<this.recetas.length;i++){
      if(this.recetas[i].titulo.toUpperCase().indexOf(this.nombre.toUpperCase())==-1){
        this.recetas.splice(i,1);
      }
    }
  }

  protected copiarRecetas(){
    this.recetas = [];

    this.noVerificadas = false;
    this.todas = true;
    this.favoritas = false;
    this.masTarde = false;

    this.controlador.getRecetas(true).forEach(receta=>{
      this.recetas.push(receta);
    });
    
    this.recetas.sort(function(a,b){
      let array1 = a.fecha.split("-");
      let array2 = b.fecha.split("-");
      let numero1 = parseInt(array1[0])*365+parseInt(array1[1])*30+parseInt(array1[2]);
      let numero2 = parseInt(array2[0])*365+parseInt(array2[1])*30+parseInt(array2[2]);


      return numero2-numero1;

    });
    
    
  }

  protected ordenarLikes(){
    this.recetas.sort(function(a,b){
      return b.likes.length-a.likes.length;
    })
  }

  protected anadirMasTarde(receta: Receta){
    this.controlador.masTarde(true, receta);
  }
  
  protected quitarMasTarde(receta: Receta){
    this.controlador.masTarde(false, receta);

    if(this.masTarde==true)this.recetas.splice(this.recetas.indexOf(receta),1);
  }

  private resetProp(){
    this.vegan=false;
    this.vegie=false;
    this.glutenFree=false;
    this.saltFree=false;
    this.fishFree=false;
    this.sugarFree=false;
  }

  protected mostrarListas(){
    if(this.controlador.getUsuario().admin==true)this.listasAdmin();
    else this.listas();
  }

  private async listasAdmin(){
    const alert = await this.alertController.create({
      animated: true,
      cssClass: 'alerta',
      message: 'Seleccione la lista a mostrar.',
      inputs: [{
        label: 'Todas las recetas',
        type: 'radio',
        value: '1',
        handler: (radio)=>{
          this.copiarRecetas();
          this.resetProp();
          alert.dismiss();
        }
      },{
        label: 'Favoritas',
        type: 'radio',
        value: '2',
        handler: (radio)=>{
          this.mostrarFavoritas();
          this.resetProp();
          alert.dismiss();
        }
      },{
        label: 'Ver más tarde.',
        type: 'radio',
        value: '3',
        handler: (radio)=>{
          this.mostrarMasTarde();
          this.resetProp();
          alert.dismiss();
        }
      },{
        label: 'Sin verificar',
        type: 'radio',
        value: '4',
        handler: (radio)=>{
          this.mostrarNoVerificadas();
          this.resetProp();
          alert.dismiss();
        }
      }],
      buttons: ["Cancelar"]
    });

    await alert.present();
  }

  private async listas(){
    const alert = await this.alertController.create({
      animated: true,
      cssClass: 'alerta',
      message: 'Seleccione la lista a mostrar.',
      inputs: [{
        label: 'Todas las recetas',
        type: 'radio',
        value: '1',
        handler: (radio)=>{
          this.copiarRecetas();
          this.resetProp();
          alert.dismiss();
        }
      },{
        label: 'Favoritas',
        type: 'radio',
        value: '2',
        handler: (radio)=>{
          this.mostrarFavoritas();  
          this.resetProp();
          alert.dismiss();
        }
      },{
        label: 'Ver más tarde',
        type: 'radio',
        value: '3',
        handler: (radio)=>{
          this.mostrarMasTarde();
          this.resetProp();
          alert.dismiss();
        }
      }],
      buttons: ["Cancelar"]
    });

    await alert.present();
  }

  protected async ordenar(){
    const alert = await this.alertController.create({
      animated: true,
      cssClass: 'alerta',
      message: 'Seleccione el criterio por el que ordenar la lista.',
      inputs: [{
        label: 'Ordenar por fecha',
        type: 'radio',
        value: '1',
        handler: (radio)=>{
          this.copiarRecetas();
          alert.dismiss();
        }
      },{
        label: 'Ordenar por likes',
        type: 'radio',
        value: '2',
        handler: (radio)=>{
          this.ordenarLikes();
          alert.dismiss();
        }
      }],
      buttons: ["Cancelar"]
    });

    await alert.present();
  }

  protected async propiedades(){
    const alert = await this.alertController.create({
      animated: true,
      cssClass: 'alerta',
      message: 'Seleccione las propiedades por las que filtrar.',
      inputs: [{
        label: 'Vegetariana',
        type: 'checkbox',
        value: '1',
        checked: this.vegie,
        handler: (checkBox)=>{
          this.vegie = checkBox.checked;
        }
      },{
        label: 'Vegana',
        type: 'checkbox',
        value: '2',
        checked: this.vegan,
        handler: (checkBox)=>{
          this.vegan = checkBox.checked;
        }
      },{
        label: 'Sin pescado',
        type: 'checkbox',
        value: '3',
        checked: this.fishFree,
        handler: (checkBox)=>{
          this.fishFree = checkBox.checked;
        }
      },{
        label: 'Sin gluten',
        type: 'checkbox',
        value: '4',
        checked: this.glutenFree,
        handler: (checkBox)=>{
          this.glutenFree = checkBox.checked;
        }
      },{
        label: 'Sin azúcar',
        type: 'checkbox',
        value: '5',
        checked: this.sugarFree,
        handler: (checkBox)=>{
          this.sugarFree = checkBox.checked;
        }
      },{
        label: 'Sin sal',
        type: 'checkbox',
        value: '6',
        checked: this.saltFree,
        handler: (checkBox)=>{
          this.saltFree = checkBox.checked;
        }
      }],
      buttons: [{
        text: 'Aceptar',
        role: 'confirm',
        cssClass: 'primary',
        handler: ()=>{
          this.buscar();
        }
      },"Cancelar"]
    });

    await alert.present();
  }
}
