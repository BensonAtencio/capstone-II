import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { initializeApp } from "firebase/app";
import { getDownloadURL , getStorage, ref, listAll, deleteObject } from "firebase/storage";

const app = initializeApp(environment.firebase);
const storage = getStorage();
const storageRef = ref(storage, 'files/');

@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.scss'],
})
export class ComponentsComponent implements OnInit {

  public files: any;

  constructor() { }

  ngOnInit() {
    this.test()
  }

  test(){

    listAll(storageRef)
    .then((res) => {
      res.items.forEach((itemRef) => {
        this.files = itemRef['name'];
        console.log(itemRef);
      });
    }).catch((error) => {
      console.log(error)
    });
  }

  download(){

    // getDownloadURL(storageRef).then((url) => {
    //   console.log(url);
    // })

  }

  delete(){

    // deleteObject(storageRef).then(() => {
    //   console.log('Deleted Successfully')
    // }).catch((error) => {
    //     console.log(error);
    // });

  }

}
