/**
 * Manager users components provides an interface to elevate/demote users for the application.
 * Users are able to input an email associated to a Firebase account and change that the user role
 * linked to that account. Users are only able to elevate a user to their current user role. 
 */
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'ngx-alerts';

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

  constructor(
    public adminService: HttpAdminService,
    public activatedRoute: ActivatedRoute,
    public alertsService: AlertService,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((user) => {
      if (user) {
        this.adminService.getAdminStatus()
            .subscribe((adminData: {admin: boolean, privilege: number}) => {
              this.options = this._totalOptions.slice(0, adminData.privilege);
            },         (error) => { // TODO: Make better error handler
              console.error(error);
            });
      } else {
        this.alertsService.danger('Error: No user!');
        console.error('NO USER');
      }
    });
  }

  changeUserRole(email: string) {
    if (email != null) {
      this.adminService.getUserUID(email).subscribe((resp) => {
        this.adminService.elevateUser(resp.uid, this.level.toString())
            .subscribe(() => {
              this.alertsService.success('Successfully elevated user!');
            },         (error) => {
              this.alertsService.warning('Error: Issue with elevating user!');
              console.error(error);
            });
      },                                            (error) => {
        this.alertsService.warning('Error: Issue with getting user UID!');
        console.error(error);
      });
    }
  }

}
