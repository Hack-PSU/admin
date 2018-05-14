/**
 * TODO: Add docstring explaining component
 */
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  providers: [
    HttpAdminService,
  ],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent implements OnInit {
  get totalOptions(): { value: number; text: string }[] {
    return this._totalOptions;
  }

  set totalOptions(value: { value: number; text: string }[]) {
    this._totalOptions = value;
  }
  get user(): firebase.User {
    return this._user;
  }

  set user(value: firebase.User) {
    this._user = value;
  }
  private _user: firebase.User;
  private _totalOptions = [
    { value: 1, text: 'Volunteer' },
    { value: 2, text: 'Team Member' },
    { value: 3, text: 'Exec' },
    { value: 4, text: 'Tech-exec' },
  ];

  public level: number;
  public email: string;
  public emailControl = new FormControl('', [Validators.required, Validators.email]);
  public options: { text, value }[]; // TODO: Refactor into proper model

  constructor(public adminService: HttpAdminService, public afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this._user = user;
        this.adminService.getAdminStatus(user)
          .subscribe((adminData) => {
            this.options = this._totalOptions.slice(0, adminData.privilege);
          },         (error) => { // TODO: Make better error handler
            console.error(error);
          });
      } else {
        console.error('NO USER');
      }
    });
  }

  makeAdmin(email: string) {
    if (email != null) {
      this.adminService.getUserUID(this._user, email).subscribe((user) => {
        console.log(user);
        this.adminService.elevateUser(this._user, user.uid, this.level.toString()).subscribe((resp) => {
        },                                                                                   (error) => {
          console.error(error);
        });
      },                                                        (error) => {
        console.error(error);
      });
    }
  }

}
