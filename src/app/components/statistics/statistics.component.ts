import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';

import { HttpAdminService } from '../../services/http-admin/http-admin.service';
import { AngularFireAuth } from 'angularfire2/auth';

import { Router } from '@angular/router';
import { StatisticsModel } from '../../models/statistics-model';
import * as firebase from 'firebase';

import { ChartsModule } from 'ng2-charts';
import { ViewChild, ElementRef } from '@angular/core';

@ViewChild('myCanvas') myCanvas: ElementRef;
public context: CanvasRenderingContext2D;

imports: [
  ChartsModule,
]


@Component({
  selector: 'app-statistics',
  providers: [
    HttpAdminService,
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  @ViewChild('myCanvas') canvasRef: ElementRef;

    //construct a static table with two columns with heads option and count
  private static tableCols = ['option', 'count'];
  public displayedColumns: string[];

    //construct a pie for academic year
  public pieChartLabels: string[] = ['freshman', 'sophomore', 'junior', 'senior', 'graduate'];
  public pieChartData: number[] = [0, 0, 0, 0];
  public pieChartType = 'pie';
  private data: any;

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }


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

  constructor(public adminService: HttpAdminService,
              public afAuth: AngularFireAuth,
              private router: Router,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    const ctx: CanvasRenderingContext2D =
          this.canvasRef.nativeElement.getContext('2d');

    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this._user = user;
        this.getStatData();
      } else {
        this.errors = new Error('Error: No user')
        console.error('No User');
      }
    },                                  (error) => {
      this.errors = new Error('Error: Issue with authentication of user');
      console.error(error);
    });
  }

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
  }

//calls the https://staging-dot-hackpsu18.appspot.com/v1/admin/statistics
  getStatData() {
    this.adminService.getStatistics(this._user)
            .subscribe((data) => {
              console.log(data);
              this.displayedColumns = StatisticsComponent.tableCols;
              data.map((value) => {
                switch (value.CATEGORY) {
                  case 'shirt_size':
                    this.tshirt_size.push(value);
                    break;
                  case 'academic_year':
                    this.academic_year.push(value);
                    break;
                }

              });
              //this.data.map(( 'academic_year') => this.pieChartData ));
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





