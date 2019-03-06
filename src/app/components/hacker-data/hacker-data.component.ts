/**
 * User data component features a latest stats header and a user data table. The table serves
 * as a means of viewing, filtering, and modifying user data without directly accessing the database.
 * The latest stats header provides the reader with a count of the number of users in each category.
 */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgProgress } from '@ngx-progressbar/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSnackBar,
} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';
import { AppConstants } from '../../helpers/AppConstants';
import { EmailListService } from '../../services/email-list/email-list.service';
import { IHackerDataModel } from '../../models/hacker-model';
import { ViewHackerDataDialogComponent } from './view-hacker-data-dialog/view-hacker-data-dialog';
import { AlertService } from 'ngx-alerts';
import { IHackerRegistrationModel } from 'app/models/hacker-registration-model';

enum HackerStatus {
  PreReg = 'pre_uid',
  Reg = 'uid',
  RSVP = 'user_id',
  CheckIn = 'user_uid',
}

@Component({
  selector: 'app-user-data',
  providers: [
    HttpAdminService,
  ],
  templateUrl: './hacker-data.component.html',
  styleUrls: ['./hacker-data.component.css'],
})

export class HackerDataComponent implements OnInit, AfterViewInit {
  private static tableCols = [
    'select', 'name', 'email', 'university', 'academic_year', 'pin', 'display',
  ];

  public displayedColumns = HackerDataComponent.tableCols;
  public dataSource = new MatTableDataSource<any>([]);
  public selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) table: MatSort;

  /*
   * Local private integers representing the counts in the latest stats header
   */
  public preRegStatNumber = 0;
  public regStatNumber = -1;
  public rsvpStatNumber = 0;
  public checkInStatNumber = -1;

  /*
   * Boolean variable for user editing Hacker Data
   */
  private canEditHackerData = false;

  /*
   * Error array used to display error messages
   */
  public errors: Error = null;

  /*
   * Table Filtering - array of categorys to filter by and currently selected category
   */
  private searchFilterOptions = [];
  private filterSelect = '';
  private orgFilterPredicate: (data: IHackerDataModel, filter: string) => boolean;

  constructor(
    public emailListService: EmailListService,
    private router: Router,
    private progressService: NgProgress,
    private snackBar: MatSnackBar,
    public adminService: HttpAdminService,
    public activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    public alertsService: AlertService,
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
        // this.getHackathons();
        this.orgFilterPredicate = this.dataSource.filterPredicate
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
   * TODO Add ability to view table data by hackathon
   */
  // getHackathons() {
  //   this.adminService.getHackathons().subscribe((data) => {
  //     console.log(data);
  //   });
  // }

  /**
   * After the initilization of all angular components, set the variables
   *
   * After the component view has been initialized, set the local data source paginiator property
   * to the new instance of pagninator. Similar effect with sort.
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
    const mFilterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = mFilterValue;
  }

  /**
   * Sets the filter category for the search/filter box.
   */
  onFilterSelection() {
    if (this.filterSelect) {
      const filterProperty = this.filterSelect;
      this.dataSource.filterPredicate =
        (data: IHackerDataModel, filter: string) =>
        data ? (data[filterProperty] ? data[filterProperty].toString().trim().toLowerCase().indexOf(filter) !== -1 : false) : false;
    } else {
      this.dataSource.filterPredicate = this.orgFilterPredicate;
    }
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
   * @exception: Failure with the admin service will cause an error to be displayed on the /userdata/ route page
   */
  loadTableData() {
    this.adminService.getAllHackers().subscribe((resp) => {
      this.displayedColumns = HackerDataComponent.tableCols;
      this.dataSource.data = resp.body.data;
      this.progressService.complete();
      let dataNames = Object.getOwnPropertyNames(resp.body.data[0]);
      dataNames = dataNames.filter(option => !option.includes('id'));
      dataNames.forEach((field) => {
        const tempObj = { value: field, viewValue: field }
        this.searchFilterOptions.push(tempObj);
      });

    },                                          (error) => {
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
   * Abstraction for refreshing the data in a table
   */
  refreshData() {
    this.errors = null;
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
   * Returns the status of a hacker for Pre-Registration, Registration, RSVP, and Check-In
   *
   * @param user Firebase User
   * @param status Hacker Status
   */
  checkHackerStatus(user, status: string) {
    let hs: HackerStatus;
    switch (status) {
      case 'PreReg': hs = HackerStatus.PreReg; break;
      case 'Reg': hs = HackerStatus.Reg; break;
      case 'RSVP': hs = HackerStatus.RSVP; break;
      case 'CheckIn': hs = HackerStatus.CheckIn; break;
      default: status = '';
    }
    if (status !== '') {
      return !!user[hs];
    }
    return false;
  }

  /**
   * Changes user status to checked in
   *
   * @param: user  User from the datasource
   */
  onClickCheckedIn(user) {
    user.check_in_status = true;
    this.adminService.setHackerCheckedIn(user.uid)
        .subscribe(() => {},
                   (error) => {
                     user.check_in_status = false;
                     this.errors = new Error('Error: Issue with manually checking user in');
                     console.error(error);
                   });
  }

  /**
   * Locally determines the permission level of the user and enables editing of hacker registration data if
   * they are above the threshold: privilege level > 3
   *
   * @exception: Failure with the admin service with cause an error to be displayed on the /userdata/ route page
   */
  checkUserPermissions() {
    this.adminService.getAdminStatus()
        .subscribe((resp) => {
          if (resp.body.data.privilege > 3) {
            this.canEditHackerData = true;
          } else {
            this.canEditHackerData = false;
          }
        },         (error) => {
          this.errors = new Error('Error: Issue with getting the privilege level of the user');
          console.error(error);
        });
  }

  /**
   * Updates the latest stats header with the current counts
   *
   * @exception: Failure with the admin service with cause an error to be displayed on the /userdata/ route page
   */
  updateStatHeader() {
    this.adminService.getAllUserCount().subscribe((data) => {
      // this.preRegStatNumber = data.preregistration_count;
      this.regStatNumber = data.registration_count;
      // this.rsvpStatNumber = data.rsvp_count;
      this.checkInStatNumber = data.checkin_count;
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
    const editPermission = this.canEditHackerData;
    const dt = { editPermission, user };
    const dialogRef = this.dialog.open(ViewHackerDataDialogComponent, {
      height: '600px',
      width: '750px',
      data: dt,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result: IHackerRegistrationModel) => {
      if (result) {
        this.progressService.start();
        this.adminService.updateHackerRegistration(result)
        .subscribe((resp) => {
          const hacker_name = result.firstName + ' ' + result.lastName;
          this.alertsService.success('Update Hacker Information for ' +  hacker_name);
          this.refreshData();
        },         (err) => {
          console.log(err);
          this.alertsService.danger('There was an issue with updating Hacker Information');
        });
      }
    })
  }
}
