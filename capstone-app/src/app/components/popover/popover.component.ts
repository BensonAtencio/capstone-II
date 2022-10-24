import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from "firebase/app";
import { getDownloadURL , getStorage, ref, listAll, deleteObject } from "firebase/storage";
import { ToastController, LoadingController, PopoverController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';


const app = initializeApp(environment.firebase);
const storage = getStorage(app);

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  public files: any[] = [];

  fname: any;

  constructor(public toastCtrl: ToastController, public loadingCtrl: LoadingController, public router: Router, public popoverController: PopoverController, private navParams: NavParams) { }

  ngOnInit() {
    this.fname = this.navParams.get('fname');
  }

  close() {
    this.popoverController.dismiss();
  }

  download(name){

    // const downloadRef = ref(storage, `files/${name}`) 
    const gsReference = ref(storage, `gs://capstone-ii-1838a.appspot.com/files/${name}`);
    
    getDownloadURL(gsReference).then(async (url) => {

      this.load();
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.send()
      xhr.onload = (event) => {
        const blob = xhr.response;
        
        let a = document.createElement("a");
          document.body.appendChild(a);
          let downurl = window.URL.createObjectURL(blob);
          a.href = downurl;
          a.download = `${name}`;
          a.click();
          
      };

      this.toast('Downloading...', 'success');
      // window.open(url);
      // console.log(url);
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
      setTimeout(function(){
        window.location.reload();
      },3050)
    })
    .catch((error) => {
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

