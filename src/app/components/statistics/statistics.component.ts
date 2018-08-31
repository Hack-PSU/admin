import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';

import { HttpAdminService } from '../../services/http-admin/http-admin.service';
import { AngularFireAuth } from 'angularfire2/auth';

import { ActivatedRoute, Router } from '@angular/router';
import { AppConstants } from '../../helpers/AppConstants';

@Component({
  selector: 'app-statistics',
  providers: [
    HttpAdminService,
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  /*
   * Error array used to display error messages
   */
  public errors: Error = null;

  /*
   *  Index of array represents the Academic Year
   *  0: Freshmen
   *  1: Sophomore
   *  2: Junior
   *  3: Senior
   *  4: Graduate
   */
  private academic_year = [];

  /*
   * Index of array represents the Coding Experience
   * 0: None
   * 1: Beginner
   * 2: Intermediate
   * 3: Advanced
   */
  private coding_experience = [];

  /*
   * Index of array represents the Dietary Restrictions
   * 0: Vegetarian
   * 1: Vegan
   * 2: Kosher
   * 3: Halal
   * 4: Gluten Free
   * 5: Other
   */
  private dietary_restrictions = [];

  private travel_reimbursement = -1;

  /*
   * Index of array represents the Race
   * 0: Native American or Alaska Native
   * 1: Asian
   * 2: Black or African American
   * 3: Hispanic or Latinx
   * 4: Native Hawaiian or Other Pacific Islander
   * 5: Caucasian
   * 6: Prefer not to disclose
   */
  private race = [];

  /*
   * Index of the array represents the shirt size
   * 0: X-Small
   * 1: Small
   * 2: Medium
   * 3: Large
   * 4: X-Large
   * 5: XX-Large
   */
  private tshirt_size = [];

  /*
   * Index of the array represents the gender they identify with
   * 0: Male
   * 1: Female
   * 2: Non-Binary
   * 3: Prefer not to disclose
   */
  private gender = [];

  /*
   * Index of the array represents the first hackathon option
   * 0: No, not their first hackathon
   * 1: Yes, it is their first hackathon
   */
  private first_hackathon = [];

  /*
   * Index of the array represents the veteran option
   * 0: No, I am not a veteran
   * 1: Yes, I am a veteran
   */
  private veteran = [];

  constructor(
    public adminService: HttpAdminService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.data
        .subscribe((user) => {
          if (user) {
            this.getStatData();
          } else {
            this.errors = new Error('Error: No user');
            console.error('No User');
          }
        },         (error) => {
          this.errors = new Error('Error: Issue with authentication of user');
          console.error(error);
        });
  }

  getStatData() {
    this.adminService.getStatistics().subscribe((data) => {
      console.log(data);
    },                                                    (error) => {
      this.errors = new Error('Error: Issue with getting the number of users');
      console.error(error);
    });
  }

}
