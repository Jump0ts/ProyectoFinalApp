import { Injectable } from '@angular/core';
import { Cuenta } from '../class/cuenta';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Receta } from '../class/receta';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { Upload } from '../class/upload';
import * as firebase from 'firebase';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ControladorService {

  private usuario: Cuenta = new Cuenta;
  private uploadTask: firebase.storage.UploadTask;

  private recetasNoVerificadas : Receta[] = [];
  private recetasVerificadas : Receta[] = [];
  private elegida : Receta = null;
  private idsDias: string[] = [];
  private diasSemana: string[] = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo']

  private verificadas: boolean = true;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth, private storage: AngularFireStorage, private router: Router) {
    
   }

  

  public login(correo){ 
    
    this.afs.collection('cuenta').doc(correo).snapshotChanges().subscribe((cuenta)=>{
      let favoritas = [];
      let masTarde = [];
      this.usuario.setCuenta(correo, cuenta.payload.data()['nombre'], cuenta.payload.data()['foto'], cuenta.payload.data()['admin']);
      
      for(let ind = 0; ind<cuenta.payload.data()['favoritas'].length; ind++){
        for(let i = 0; i<this.recetasVerificadas.length;i++){
          if(this.recetasVerificadas[i].id == cuenta.payload.data()['favoritas'][ind]){
            favoritas.push(this.recetasVerificadas[i]);
            i = this.recetasVerificadas.length;
          }
        };
      };

      for(let ind = 0; ind<cuenta.payload.data()['masTarde'].length; ind++){
        for(let i = 0; i<this.recetasVerificadas.length;i++){
          if(this.recetasVerificadas[i].id == cuenta.payload.data()['masTarde'][ind]){
            masTarde.push(this.recetasVerificadas[i]);
            i = this.recetasVerificadas.length;
          }
        };
      };
      
      this.usuario.masTarde = masTarde;
      this.usuario.favoritas = favoritas;
    });

    this.afs.collection('semana').doc(correo).snapshotChanges().subscribe((dias)=>{
      
      for(let ind=0; ind<this.diasSemana.length;ind++){
        this.idsDias.push(dias.payload.data()[this.diasSemana[ind]]);
        this.afs.collection('dia').doc(dias.payload.data()[this.diasSemana[ind]]).snapshotChanges().subscribe((comidas)=>{
          let array = [];
          array.push(this.buscaRecetaVerificada(comidas.payload.data()['desayuno']));
          array.push(this.buscaRecetaVerificada(comidas.payload.data()['comida']));
          array.push(this.buscaRecetaVerificada(comidas.payload.data()['merienda']));
          array.push(this.buscaRecetaVerificada(comidas.payload.data()['cena']));

          this.usuario.setDiaSemana(this.diasSemana[ind], array);
        });
      }
    });
  }

  public insertCuenta(cuenta:{ correo:string, foto: string, usuario: string}){
    let lunes = this.afs.createId();
    let martes = this.afs.createId();
    let miercoles = this.afs.createId();
    let jueves = this.afs.createId();
    let viernes = this.afs.createId();
    let sabado = this.afs.createId();
    let domingo = this.afs.createId();
    this.afs.collection('cuenta').doc(cuenta['correo']).set({
      nombre: cuenta['usuario'],
      foto: cuenta['foto'],
      admin: false,
      favoritas: [],
      semana: cuenta['correo'],
      masTarde: []
    }).then(success=>{
      console.log('cuenta creada');
    });

    this.afs.collection('semana').doc(cuenta['correo']).set({
      lunes,
      martes,
      miercoles,
      jueves,
      viernes,
      sabado,
      domingo
    }).then(success=>{
      console.log('semana creada');
    });

    this.afs.collection('dia').doc(lunes).set({
      comida: "",
      desayuno: "",
      merienda: "",
      cena: ""
    }).then(success=>{
      console.log('dia creado');
    });

    this.afs.collection('dia').doc(martes).set({
      comida: "",
      desayuno: "",
      merienda: "",
      cena: ""
    }).then(success=>{
      console.log('dia creado');
    });

    this.afs.collection('dia').doc(miercoles).set({
      comida: "",
      desayuno: "",
      merienda: "",
      cena: ""
    }).then(success=>{
      console.log('dia creado');
    });

    this.afs.collection('dia').doc(jueves).set({
      comida: "",
      desayuno: "",
      merienda: "",
      cena: ""
    }).then(success=>{
      console.log('dia creado');
    });

    this.afs.collection('dia').doc(viernes).set({
      comida: "",
      desayuno: "",
      merienda: "",
      cena: ""
    }).then(success=>{
      console.log('dia creado');
    });

    this.afs.collection('dia').doc(sabado).set({
      comida: "",
      desayuno: "",
      merienda: "",
      cena: ""
    }).then(success=>{
      console.log('dia creado');
    });

    this.afs.collection('dia').doc(domingo).set({
      comida: "",
      desayuno: "",
      merienda: "",
      cena: ""
    }).then(success=>{
      console.log('dia creado');
    });
  }

  public loadRecetas(){
    this.recetasVerificadas = [];
    this.recetasNoVerificadas = [];
    this.afs.collection('receta').get().subscribe((recetas)=>
    {
      recetas.forEach(receta=>{
        if(receta.data()['verificado']==true){
          this.recetasVerificadas.push(new Receta(receta.id, receta.data()['titulo'], receta.data()['descripcion'], receta.data()['autor'], receta.data()['propiedades'], receta.data()['verificado'], receta.data()['likes'], receta.data()['fecha'], receta.data()['foto']));
        }
        else{
          this.recetasNoVerificadas.push(new Receta(receta.id, receta.data()['titulo'], receta.data()['descripcion'], receta.data()['autor'], receta.data()['propiedades'], receta.data()['verificado'], receta.data()['likes'], receta.data()['fecha'], receta.data()['foto']));
        }
      });
    
    });
  }

  public getReceta(id: string): Receta{
    
    if(this.verificadas){
      this.recetasVerificadas.forEach((receta)=>{
        if(receta.id==id){
          this.elegida = receta;
        }
      });
    }
    else{
      this.recetasNoVerificadas.forEach((receta)=>{
        if(receta.id==id){
          this.elegida = receta;
        }
      });
    }
    return this.elegida;
  }

  public getRecetas(bool: boolean){
    this.verificadas = bool;
    if(bool){
      return this.recetasVerificadas;
    }
    else{
      return this.recetasNoVerificadas;
    }
   
  }

  public getUsuario(){
     return this.usuario;
  }

  private insertReceta(titulo:string, desc: string[], propiedades: string[], foto: string){
    let date = new Date();
    let data = {
        titulo,
        descripcion: desc,
        propiedades,
        likes: [],
        foto,
        fecha: date.toISOString().substring(0,date.toISOString().indexOf('T')),
        verificado: false,
        autor: this.usuario.correo
    }
    this.afs.collection('receta').add(data).then((receta)=>{
      this.recetasNoVerificadas.push(new Receta(receta.id, titulo, desc, this.usuario.correo, propiedades, false, [], date.toISOString().substring(0,date.toISOString().indexOf('T')),foto));
    });
  }

  public uploadReceta(titulo:string, desc: string[], propiedades: string[], imagen: File){
    const basePath = 'Receta/'
    let upload = new Upload(imagen);
    upload.name = titulo+"-"+this.usuario.correo;
    this.uploadTask = firebase.storage().ref().child(`${basePath}/${upload.name}`).put(upload.file);

    this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot)=>{
        //progreso
      },
      (error)=>{
        //error
        console.log(error);
      },
      ()=>{
        //final correcto
        this.uploadTask.snapshot.ref.getDownloadURL().then(url=>{
          this.insertReceta(titulo,desc,propiedades,url);
        });
      })
     
     
  }

  public actualizaMG(mg: boolean, receta: Receta){
     let indReceta = this.recetasVerificadas.indexOf(receta);
     if(mg == true){
        this.recetasVerificadas[indReceta].likes.push(this.usuario.correo);
     }
     else{
      this.recetasVerificadas[indReceta].likes.splice(this.recetasVerificadas[indReceta].likes.indexOf(this.usuario.correo),1);
     }

    this.actualizarReceta(this.recetasVerificadas[indReceta]);
   }

  public actualizarFav(fav: boolean, receta: Receta){
    if(fav == true){
       this.usuario.favoritas.push(receta);
    }
    else{
     this.usuario.favoritas.splice(this.usuario.favoritas.indexOf(receta),1);
    }

    this.actualizarArraysUsuario();
  }

  public verificar(){
    this.elegida.verificado = true;
    this.actualizarReceta(this.elegida);
  }

  private actualizarReceta(receta: Receta){
    this.afs.collection('receta').doc(receta.id).set({
      titulo: receta.titulo,
      descripcion: receta.descripcion,
      propiedades: receta.propiedades,
      likes: receta.likes,
      foto: receta.foto,
      fecha: receta.fecha,
      verificado: receta.verificado,
      autor: receta.correoAutor
    }).finally(function(){
      console.log('actualizada correctamente');
    });
  }

  public eliminar(receta: Receta){
    this.storage.ref("Receta/"+receta.titulo+"-"+receta.correoAutor).delete();
    this.afs.collection('receta').doc(receta.id).delete();
  }

  private buscaRecetaVerificada(id){
    for(let i = 0; i<this.recetasVerificadas.length;i++){
      if(this.recetasVerificadas[i].id==id){
        return this.recetasVerificadas[i];
      }
    }
  }

  public checkCalendar(dia: string, comida: number): boolean{
    let bool = false;

    
    
    if(this.usuario.semana.get(dia)[comida]!=undefined){
      bool=true;
    }

    return bool;
  }

  public anadirComidaSemana(dia: string, comida: number, receta: Receta){
    let array = [];
    this.usuario.semana.get(dia)[comida] = receta;

    for(let i = 0; i<this.usuario.semana.get(dia).length;i++){
      if( this.usuario.semana.get(dia)[i]==undefined){
        array.push("");
      }
      else{
        array.push(this.usuario.semana.get(dia)[i].id);
      }
    }

    this.afs.collection("dia").doc(this.idsDias[this.diasSemana.indexOf(dia)]).set({
      desayuno: array[0],
      comida: array[1],
      merienda: array[2],
      cena: array[3]
    }).then(()=>{
      console.log('calendario actualizado correctamente');
      
    })
  }

  public cambiaConfig(nombre: string, foto: File){
    const basePath = 'Imagen_perfil/'
    let upload = new Upload(foto);
    upload.name = this.usuario.correo;


    this.storage.ref(basePath+this.usuario.correo).delete();


    this.uploadTask = firebase.storage().ref().child(`${basePath}/${upload.name}`).put(upload.file);

    this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot)=>{
        //progreso
      },
      (error)=>{
        //error
        console.log(error);
      },
      ()=>{
        //final correcto
        this.uploadTask.snapshot.ref.getDownloadURL().then(url=>{
          let array = [];
    

          for(let i = 0; i<this.usuario.favoritas.length;i++){
            array.push(this.usuario.favoritas[i].id);
          }

          this.afs.collection('cuenta').doc(this.usuario.correo).set({
            admin: this.usuario.admin,
            favoritas: array,
            foto: url,
            nombre,
            semana: this.usuario.correo
          }).then(()=>{
            this.usuario.usuario = nombre;
            console.log("usuario modificado correctamente");
            
          }).catch(()=>{
            console.log("ha ocurrido un error en la modificación");
            
          })
        });
      });
  }

  public cambiaConfigNombre(nombre: string){
    let array = [];
    

    for(let i = 0; i<this.usuario.favoritas.length;i++){
      array.push(this.usuario.favoritas[i].id);
    }

    this.afs.collection('cuenta').doc(this.usuario.correo).set({
      admin: this.usuario.admin,
      favoritas: array,
      foto: this.usuario.foto,
      nombre,
      semana: this.usuario.correo
    }).then(()=>{
      this.usuario.usuario = nombre;
      console.log("usuario modificado correctamente");
      
    }).catch(()=>{
      console.log("ha ocurrido un error en la modificación");
      
    })
  }

  public masTarde(bool: boolean, receta: Receta){
    if(bool==true){
      this.usuario.masTarde.push(receta);
      console.log('a');
      
    }
    else{
      this.usuario.masTarde.splice(this.usuario.masTarde.indexOf(receta),1);
    }

    this.actualizarArraysUsuario();
   
  }

  private actualizarArraysUsuario(){
    let arrayIdFav = [];
    let arrayIdMasTarde = [];

    for(let i = 0; i<this.usuario.masTarde.length;i++){
      arrayIdMasTarde.push(this.usuario.masTarde[i].id);
    }

    for(let i = 0; i<this.usuario.favoritas.length;i++){
      arrayIdFav.push(this.usuario.favoritas[i].id);
    }

   this.afs.collection('cuenta').doc(this.usuario.correo).set({
    nombre: this.usuario.usuario,
    foto: this.usuario.foto,
    admin: this.usuario.admin,
    favoritas: arrayIdFav,
    masTarde: arrayIdMasTarde
   }).then(success=>{
     console.log('añadido');
   });
  }
}
