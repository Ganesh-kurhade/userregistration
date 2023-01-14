import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Action } from './helpers/action.enum';
import { MustMatch } from './helpers/must-watch-validator';
import { UserApi } from './helpers/user-api.service';
import { User } from './helpers/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'User Registration';
  addForm: FormGroup;
  submited: boolean = false;
  buttonText: string = "";
  formTitle: string= "";
  dbops: Action;

  @ViewChild('content') elContent: any
  modalRef: any;

  userData : User[] = [];

  constructor(private _toastr: ToastrService, private modalService: NgbModal,private _userApi:UserApi) { }

  ngOnInit() {
    this.setFormState();
    this.getAllUsers();   //call API fun.
  }

  setFormState() {

    this.buttonText = "Save";     //initial Button Name
    this.formTitle = "Add User";
    this.dbops = Action.create;

    this.addForm = new FormGroup({
      id: new FormControl(0),
      title: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      lastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      dob: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      confirmPassword: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      acceptTerms: new FormControl(false, Validators.requiredTrue),

    },MustMatch('password','confirmPassword'));
  }

  get ctrl() {
    return this.addForm.controls;     //change to addForm.controls => ctrl
  }

  addUser() {
    this.submited = true;

    if (this.addForm.invalid) {
      return;
    }

    switch (this.dbops) {
      case Action.create:
        //code here to SAVE data in database
          this._userApi.addUser(this.addForm.value).subscribe(res =>{
          this._toastr.success("User Added !!", "User Registration")
          this.getAllUsers();
          this.cancelForm();
        })
        break;

      case Action.update:
        //code here to UPDATE data in database
        this._userApi.updateUser(this.addForm.value).subscribe(res =>{
          this._toastr.success("User Updated !!", "User Registration")
          this.getAllUsers();
          this.cancelForm();
        })
        break;
    }
  }
  cancelForm() {

    this.buttonText = "Save";
    this.formTitle = "Add User";
    this.dbops = Action.create;
    this.submited = false;
    this.addForm.reset({
      id: 0,
      title: '',
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    })
    this.modalRef.close();
  }

  // Bind All Data From API
  getAllUsers()
  {
    this._userApi.getUsers().subscribe((res : User[]) =>{
    this.userData = res;
    });
  }

  openXl(content: any) {

    this.modalRef = this.modalService.open(content, { size: 'xl' });
  }
  edit(userId: number) {

    this.buttonText = "Update";     //secondary Button Name
    this.formTitle = "Update User"
    this.dbops = Action.update;
    //database code
    let user = this.userData.find((u : User) => u.id === userId);
    this.addForm.patchValue(user);

    this.addForm.get('password').setValue('');
    this.addForm.get('confirmPassword').setValue('');
    this.addForm.get('acceptTerms').setValue(false);

    this.modalRef = this.modalService.open(this.elContent, { size: 'xl' });
  }
  delete(id: number) {
     Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it!'
    }).then((result) => {
      if (result.isConfirmed) {

        //code here to delete database
        this._userApi.deleteUser(id).subscribe(res =>{
          this.getAllUsers();

        Swal.fire(
          'Deleted!',
          'User data has been deleted.',
          'success'
        )
        })
      }else{
        Swal.fire(
          'cancel!',
          'Your record is safe.',
          'error'
        )
      }
    })
  }
}
