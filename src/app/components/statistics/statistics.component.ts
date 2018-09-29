import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

import { HttpAdminService } from '../../services/http-admin/http-admin.service';
import { StatisticsModel } from '../../models/statistics-model';

import * as firebase from 'firebase';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  providers: [
    HttpAdminService,
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {

  pieDim: any[] = [700, 500];
  piecolor = {
    domain: ['#007486', '#00743C', '#00AEBF', '#333333', '#004A68', '#EBF5FB'],
  };
  //legend = true;
  labels = true;
  dietarydata: { value: Number, name: string }[] = [];

  // construct a static table with two columns with heads option and count
  private static tableCols = ['option', 'count'];
  public displayedColumns: string[];

  get user(): firebase.User {
    return this._user;
  }

  set user(value: firebase.User) {
    this._user = value;
  }

  public StatData = new MatTableDataSource<StatisticsModel>([]); // [] = array

  private _user: firebase.User;
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

  private loadpiechart = [];

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
  private dietary_restriction = [];

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
  private race = []

    /*
     * Index of the array represents the shirt size
     * 0: X-Small
     * 1: Small
     * 2: Medium
     * 3: Large
     * 4: X-Large
     * 5: XX-Large
     */
  public tshirt_size = [];

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

//calls the https://staging-dot-hackpsu18.appspot.com/v1/admin/statistics
  getStatData() {
    this.adminService.getStatistics()
            .subscribe((data) => {
              this.displayedColumns = StatisticsComponent.tableCols;
              data.map((value) => {
                switch (value.CATEGORY) {
                  case 'shirt_size': {
                    this.tshirt_size.push(value);
                    break;
                  }
                  case 'dietary_restriction': {
                    this.dietary_restriction.push(value);
                    break;
                  }
                  default: {
                    break;
                  }
                }
                this.dietarydata = this.dietary_restriction
                    .filter(element => element.OPTION !== '' && element.OPTION !== null)
                    .map(element => ({ value: element.COUNT, name: element.OPTION }));
              });
            },         (error) => {
              this.errors = new Error('Error: Issue with getting the number of users');
              console.error(error);
            });
  }
    //filter only for shirt sizes, it specifies the category, technically it doesn't need it because of the filter in get data
  shirtsizefilter() {
    return this.StatData.data.filter((data) => data.CATEGORY === 'academic_year');
  }
}