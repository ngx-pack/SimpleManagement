import {AuthService} from '../../providers/auth.service';
import {FileHolder} from 'angular2-image-upload';
import {Router} from '@angular/router';
import {Component, IterableDiffers, OnInit} from '@angular/core';


@Component({
  selector: 'app-addproject',
  templateUrl: './addproject.component.html',
  styleUrls: ['./addproject.component.css']
})
export class AddprojectComponent implements OnInit {

  //project object
  project = {
    name: '',
    description: '',
    start: '',
    deadline: '',
    cost: '',
    tasks: []
  };

  checkboxJSON: Array<any> = [];
  noticeJSON: Array<any> = [];
  images: Array<any> = [];
  imageFiles: Array<any> = [];
  isAddNewTodo = false;
  iterableDiffer: any;
  changes = false;

  constructor(private authService: AuthService, private router: Router, private _iterableDiffers: IterableDiffers) {
    this.iterableDiffer = this._iterableDiffers.find([]).create(null);
  }

  ngOnInit() {
  }

  //function for new to do element
  addNewToDo() {
    this.isAddNewTodo = true;
    var todo = window.prompt('Add a todo', 'defaultText');
    var checkboxId = this.generateId();
    this.checkboxJSON.push({'label': todo, 'checked': false, 'id': checkboxId});
  }

  //check checkbox or uncheck checkbox
  checkboxChange(event: any, id: any) {
    for (let task of this.checkboxJSON) {
      if (id === task.id) {
        task.checked = event.currentTarget.checked;
      }
    }
  }

  //function for new note
  addNewNotice() {
    var note = window.prompt('Add a note', 'defaultText');
    var noticeUl = document.getElementById('notice');
    var list = document.createElement('li');
    var label = document.createElement('label');
    label.innerText = note;
    list.appendChild(label);
    noticeUl.appendChild(list);
    this.noticeJSON.push(note);
  }

  //save the project
  async saveNewProject() {
    this.images = await this.authService.saveToStorage(this.imageFiles);
    if (this.authService.addNewProject(this.project, this.checkboxJSON, this.noticeJSON, this.images)) {
      confirm('Save was successful');
      this.router.navigate(['main']);
    } else {
      confirm('Save was unsuccessful');
    }
  }

  //uid for the project
  generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  //function for the img upload
  async onUploadFinished(file: FileHolder) {
    this.imageFiles.push(file);
    console.log(this.imageFiles[0]);
  }

  //function for removing the img
  onRemoved(file: FileHolder) {
    this.imageFiles.forEach((item, index) => {
      if (item === file) this.imageFiles.splice(index, 1);
    });
  }

  onUploadStateChanged(state: boolean) {
    console.log(state);
  }

}
