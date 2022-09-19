import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from "firebase/app";
import { getDownloadURL , getStorage, ref, listAll, deleteObject } from "firebase/storage";
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

const app = initializeApp(environment.firebase);
const storage = getStorage(app);
const storageRef = ref(storage, 'files/');

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss'],
})
export class ComponentsComponent implements OnInit {

  public files: any[] = [];

  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public router: Router) { }

  ngOnInit() {
    this.list()
  }

  list(){

    listAll(storageRef)
    .then((res) => {
      res.items.forEach((itemRef) => {
        this.files.push(itemRef.name);
        // this.files = Array.of(itemRef);
        // console.log(this.files);
      });
    }).catch((error) => {
      console.log(error)
    });
  }

  download(name){

    const downloadRef = ref(storage, `files/${name}`) 
    getDownloadURL(downloadRef).then(async (url) => {

      this.load();
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send()

      this.toast('Downloading...', 'success');
      // // window.open(url);
      console.log(url);
  })
  .catch((error) => {
    console.log(error);
  });
   

  }

  deletefile(name){

    const deleteRef = ref(storage, `files/${name}`);
      deleteObject(deleteRef).then(async () => {
        this.load();
        this.toast('Deleted Successfully', 'success');
    }).catch((error) => {
        console.log(error);
    });

  }

  async toast(message, status){
    const toast = await this.toastCtrl.create({
      message: message,
      color: status,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

  async load() {
    const loading = await this.loadingCtrl.create({
      duration: 2000,
      spinner: 'circles',
      showBackdrop: true
    });

    loading.present();
  }

}
