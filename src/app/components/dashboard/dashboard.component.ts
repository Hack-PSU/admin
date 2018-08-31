/*
 * Dashboard style landing page when logging into the Admin Web Application. It has card style links for
 * easy access to different pages. Each link is protected by the router guard.
 */
import { Component, OnInit } from '@angular/core';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';

import { AngularFireAuth } from 'angularfire2/auth';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  providers: [
               HttpAdminService,
             ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  constructor(
    public adminService: HttpAdminService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
  }

  /**
   * On the initilization of all angular components, execute the functions
   *
   * Retrieves the current user from authentication then sets the local variable
   *
   * @exception: Failure on the auth service will cause an error to be displayed on the /userdata/ route page
   * @exception: Issue with the user not existing in the auth service database will cause an error to be
   *             displayed on the /userdata/ route page
   */
  ngOnInit() {
    this.activatedRoute.data
      .subscribe((user) => {
        console.log(user);
      });
  }
}


