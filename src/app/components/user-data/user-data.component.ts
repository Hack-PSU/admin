/**
 * User data component features a latest stats header and a user data table. The table serves
 * as a means of viewing, filtering, and modifying user data without directly accessing the database.
 * The latest stats header provides the reader with a count of the number of users in each category.
 */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';

import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSnackBar,
} from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';

import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstants } from '../../helpers/AppConstants';
import { EmailListService } from '../../services/email-list/email-list.service';

import { CountModel } from '../../models/count-model';

import { ViewUserDataDialogComponent } from './view-user-data-dialog';
import { NgProgress } from '@ngx-progressbar/core';

@Component({
  selector: 'app-user-data',
  providers: [
    HttpAdminService,
  ],
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css'],
})

export class UserDataComponent implements OnInit, AfterViewInit {
  private static tableCols = [
    'select', 'name', 'email', 'university', 'academic_year', 'pin', 'display',
  ];

  public displayedColumns = UserDataComponent.tableCols;
  public dataSource = new MatTableDataSource<any>([]);
  public selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) table: MatSort;

  /*
   * Local private integers representing the counts in the latest stats header.
   */
  private preRegStatNumber = -1;
  private regStatNumber = -1;
  private rsvpStatNumber = -1;
  private checkInStatNumber = -1;

  /*
   * Boolean variables used to display the edit column in the user table
   */
  // private displayEditCol = false;
  private editToggleDisable = true;

  /*
   * Error array used to display error messages
   */
  public errors: Error = null;

  constructor(
    public emailListService: EmailListService,
    private router: Router,
    private progressService: NgProgress,
    private snackBar: MatSnackBar,
    public adminService: HttpAdminService,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
  ) {
  }

  /**
   * On the initilization of all angular components, execute the functions
   *
   * Retrieves the current user from authentication then calls to check the user permission level.
   * Next it calls to update the latest stats header and retrieve the data for the user table.
   *
   * @exception: Failure on the auth service will cause an error to be displayed on the /userdata/ route page
   * @exception: Issue with the user not existing in the auth service database will cause an error to be displayed
   *              on the /userdata/ route page
   */
  ngOnInit() {
    this.activatedRoute.data.subscribe((user) => {
      if (user) {
        this.checkUserPermissions();
        this.updateStatHeader();
        this.loadTableData();
      } else {
        this.errors = new Error('Error: No user');
        console.error('No User');
      }
    },                                 (error) => {
      this.errors = new Error('Error: Issue with authentication of user');
      console.error(error);
    });
  }

  /**
   * After the initilization of all angular components, set the variables
   *
   * After the component view has been initialized, set the local data source paginiator property
   * to the new instance of pagninator. Similar effect with sort.
   *
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.table;
  }

  /**
   * Modify the data source to only have the filtered results
   *
   * Convert the filter value (string) to lowercase and remove any additional spacing. Then
   * set the filter property of the local datasource to the new filter value.
   *
   * @param: filterValue  String to filter the datasource
   */
  applyFilter(filterValue: string) {
    let mFilterValue = filterValue.trim();
    mFilterValue = mFilterValue.toLowerCase();
    this.dataSource.filter = mFilterValue;
  }

  /**
   * Determine if the number of selected elements matches the total number of rows
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected, otherwise clear selection.
   */
  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * Retrieve and load the user data into the datasource
   *
   * Call the admin service request to retrieve the user data. Then set the columns names to
   * the entries defined in tableCols and the datasource data to the request response data.
   *
   * @exception: Failure with the admin service with cause an error to be displayed on the /userdata/ route page
   */
  loadTableData() {
    this.adminService.getAllUsers().subscribe((data) => {
      this.displayedColumns = UserDataComponent.tableCols;
      this.dataSource.data = data;
      this.progressService.complete();
    },                                        (error) => {
      this.errors = new Error('Error: Issue with loading the user table. Please refresh the page.');
      console.error(error);
    });
  }

  /**
   * Sets the email list of the email service to the rows selected and routes to the email page
   *
   * @exception: Failure with the admin service with cause an error to be displayed on the /userdata/ route page
   */
  sendEmail() {
    this.emailListService.emailList = this.selection.selected;
    this.router.navigate([AppConstants.EMAIL_ENDPOINT])
        .catch(e => console.error(e));
  }

  /**
   * Abstraction for refreshing the data in a table, executes the loadTableData function
   */
  refreshData() {
    this.loadTableData();
  }

  /**
   * Opens the local snackbar for 2000 ms
   *
   * @param: message  Message to be displayed in the snackbar
   * @param: action  Action to be executed on clicking the snackbar
   */
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  /**
   * Conversion from one numerical base to another numerical base
   *
   * @param: str  String representing the number
   * @param: fromBase String representing the base to convert from
   * @param: toBase  String representing the base to conver to
   */
  convertFromBaseToBase(str, fromBase, toBase) {
    if (str == null) {
      return 'N/A';
    }
    const num = parseInt(str, fromBase);
    return num.toString(toBase);
  }

  /**
   * Determines if the user has preregistered based on if their property id exists (id > 0)
   *
   * @param: user  User from the datasource
   */
  isPreRegistered(user) {
    return !!user.uid;
  }

  /**
   * Determines if the user has registered based on if their property uid exists (uid > 0)
   *
   * @param: user  User from the datasource
   */
  isRegistered(user) {
    return !!user.uid;
  }

  /**
   * Determines if the user has rsvp'd based on if their property user_id exists (user_id > 0)
   *
   * @param: user  User from the datasource
   */
  isRSVP(user) {
    return !!user.user_id;
  }

  /**
   * Determines if the user has checked in based on if their property user_uid exists (user_uid > 0)
   *
   * @param: user  User from the datasource
   */
  isCheckedIn(user) {
    return !!user.user_uid;
  }

  /**
   * Locally determines the permission level of the user and enables the edit toggle feature if
   * they are above the threshold: privilege level > 3
   *
   * @exception: Failure with the admin service with cause an error to be displayed on the /userdata/ route page
   */
  checkUserPermissions() {
    this.adminService.getAdminStatus()
        .subscribe((resp) => {
          if (resp.privilege > 3) {
            this.editToggleDisable = false;
          }
        },         (error) => {
          this.errors = new Error('Error: Issue with getting the privilege level of the user');
          console.error(error);
        });
  }

  /**
   * Updates the user table dependent on the toggle of the edit slide toggle.

   displayEditColumn() {
    if(this.displayEditCol == false) {
      UserDataComponent.tableCols = UserDataComponent.tableCols.concat('edit');
      this.displayEditCol = true;
      this.onUserClick();
    } else {
      var new_len = UserDataComponent.tableCols.length - 1;
      UserDataComponent.tableCols = UserDataComponent.tableCols.slice(0, new_len);
      this.displayEditCol = false;
      this.onUserClick();
    }
  }
   */

  /**
   * Updates the latest stats header with the current counts
   *
   * @exception: Failure with the admin service with cause an error to be displayed on the /userdata/ route page
   */
  updateStatHeader() {
    this.adminService.getAllUserCount().subscribe((data) => {
      const countArray: CountModel[] = data;
      this.preRegStatNumber = parseInt(countArray[0].pre_count, 10);
      this.regStatNumber = parseInt(countArray[1].pre_count, 10);
      this.rsvpStatNumber = parseInt(countArray[2].pre_count, 10);
      this.checkInStatNumber = parseInt(countArray[3].pre_count, 10);
    },                                            (error) => {
      this.errors = new Error('Error: Issue with getting the number of users');
      console.error(error);
    });
  }

  /**
   * Opens a modal for displaying more single user information, located in ViewUserDataDialog.ts
   *
   * @param: user  single user data
   */
  viewAdditionalUserData(user) {
    user['admin_edit_permission'] = this.editToggleDisable;
    const dialogRef = this.dialog.open(ViewUserDataDialogComponent, {
      height: '600px',
      data: user,
      autoFocus: false,
    });
  }
}
