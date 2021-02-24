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
} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';
import { AppConstants } from '../../helpers/AppConstants';
import { EmailListService } from '../../services/email-list/email-list.service';
import { IHackerDataModel } from '../../models/hacker-model';
import { ViewHackerDataDialogComponent } from './view-hacker-data-dialog/view-hacker-data-dialog';
import { AlertService } from 'ngx-alerts';
import { IHackerRegistrationModel } from '../../models/hacker-registration-model';
import { IMatSelectionModel } from '../../models/interfaces/mat-selection-interface';
import { IHackathonModel } from '../../models/hackathon-model';
import { IApiResponseModel } from '../../models/api-response-model';

enum HackerStatus {
  PreReg = 'pre_uid',
  Reg = 'uid',
  RSVP = 'user_id',
  CheckIn = 'user_uid',
  NULL = '',
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
  public searchFilterOptions = [];
  public filterSelect = '';
  public orgFilterPredicate: (data: IHackerDataModel, filter: string) => boolean;

  public activeHackathon: IHackathonModel;
  public hackathonOptions: IMatSelectionModel[];
  public selectedHackathon: IMatSelectionModel;

  constructor(
    public emailListService: EmailListService,
    private router: Router,
    private progressService: NgProgress,
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
   * Then it calls to get the list of hackathons and stores a copy of the filter predicate.
   *
   * @exception: Failure on the auth service will cause an error to be displayed on the /userdata/ route page
   * @exception: Issue with the user not existing in the auth service database will cause an error to be displayed
   *              on the /userdata/ route page
   */
  ngOnInit() {
    this.activeHackathon = null;
    this.activatedRoute.data.subscribe((user) => {
      if (user) {
        this.checkUserPermissions();
        this.getHackathons();
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
   * Gets a list of the all the available hackathons to view data for
   *
   * Retrieves a list of all the hackathons in the database to be able to switch between and sets up the
   * drop down menu. Then signals to load the table data and update the latest statistics header.
   *
   * @exception: Failure with the admin service will cause an error to be displayed on the /userdata/ route page
   */
  getHackathons() {
    this.adminService.getHackathons().subscribe((data: IHackathonModel[]) => {
      this.hackathonOptions = [];
      data.map((hackathon) => {
        if (hackathon.active) {
          hackathon.name += ' - Current';
          this.activeHackathon = hackathon;
        }
        this.hackathonOptions.push({
          value: hackathon.uid, viewValue: hackathon.name,
        });
      });
      this.loadTableData(this.activeHackathon.uid);
      this.updateStatHeader(this.activeHackathon.uid);
    },                                          (error) => {
      this.hackathonOptions = [];
      this.hackathonOptions.push({ value: 'error', viewValue: 'Error Occurred' });
      this.errors = new Error('Error: Issue with loading the hackathon options. Please refresh the page.');
      console.error(error);
    });
  }

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
   * Retrieve and load the hacker data into the datasource
   *
   * Call the admin service request to retrieve the hacker data. Then set the columns names to
   * the entries defined in tableCols and the datasource data to the request response data.
   *
   * @exception: Failure with the admin service will cause an error to be displayed on the /userdata/ route page
   */
  loadTableData(hackathonUid?: string) {
    this.adminService.getAllHackers(null, hackathonUid).subscribe((resp) => {
      this.displayedColumns = HackerDataComponent.tableCols;
      this.dataSource.data = resp.body.data;
      this.progressService.complete();
      let dataNames = Object.getOwnPropertyNames(resp.body.data[0]);
      dataNames = dataNames.filter(option => !option.includes('id'));
      dataNames.forEach((field) => {
        const tempObj = { value: field, viewValue: field }
        this.searchFilterOptions.push(tempObj);
      });

    },                                                            (error) => {
      this.errors = new Error('Error: Issue with loading the hacker table. Please refresh the page.');
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
  refreshData(hackathon?: IMatSelectionModel) {
    this.errors = null;
    if (hackathon) {
      this.loadTableData(hackathon.value);
      this.updateStatHeader(hackathon.value);
    } else {
      this.loadTableData(this.activeHackathon.uid);
      this.updateStatHeader(this.activeHackathon.uid);
    }
  }

  /**
   * Exporting hacker data into a Excel sheet (.csv)
   */
  exportData(limit?: number, hackathon?: string) {
    let csvData = '';
    // information header
    csvData += '"' + 'pre_uid' + '",' + 'Registration ID' + '",' + '"' + 'FirstName' + '",' + '"' + 'Last Name' + '",' + '"' + 'Gender' + '",'
      + '"' + '18 Before Event' + '",' + '"' + 'Shirt Size' + '",' + '"' + 'Dietary Restrictions' + '",' + '"' + 'Allergies' + '",' + '"' + 'Travel Reimbursement' + '",' + '"' + 'First Hackathon' + '",'
      + '"' + 'University' + '",' + '"' + 'Email' + '",'  + '"' + 'Academic Year' + '",' + '"' + 'Major' + '",' + '"' + 'Resume' + '",' + '"' + 'COC' + '",' + '"' + 'DCP' + '",'
      + '"' + 'Phone Number' + '",' + '"' + 'Race' + '",' + '"' + 'Coding Experience' + '",' + '"' + 'Referral Source' + '",' + '"' + 'Project Desc' + '",' + '"' + 'Active???' + '",'
      + '"' + 'Expectations' + '",' + '"' + 'Veteran' + '",' + '"' + 'PIN Number' + '",' + '"' + 'Time' + '",' + '"' + 'Hackathon ID' + '",' + '"' + 'Hackathon' + '",'
      + '"' + 'Start Time' + '",' + '"' + 'End Time' + '",' + '"' + 'Base Pin' + '",' + '"' + 'Submitted' + '",' + '"' + 'RSVP ID' + '",' + '"' + 'RSVP Time' + '",' + '"' + 'RSVP Status' + '",'
      + '"' + 'user_uid' + '",';
    csvData = csvData.substr(0, csvData.length - 1) + '\n';
    console.log('export csv called');
    this.adminService.getAllHackers(limit, hackathon).subscribe({
      next: (resp: IApiResponseModel<IHackerDataModel[]>) => {
        console.log(resp.body.data);  // this is the array output
        const hackerArray = resp.body.data;
        // iterate through each entry of the array
        hackerArray.forEach((hacker: IHackerDataModel) => {
          // hacker contains the individual information of a single hacker
          // console.log(hacker);
          // if we want to iterate through the properties of a hacker, reference them individually
          console.log(hacker.firstname);
          // if we want to iterate through all the properties of a hacker
          Object.keys(hacker).forEach((key: string) => {
            // a key in this case is the property of the hacker object, think of maps
            // console.log(key);
            // we use the [bracket notation] instead . because our key is variable --> object[key]
            csvData += '"' + hacker[key] + '",';
          });
          csvData = csvData.substr(0, csvData.length - 1) + '\n';
        });
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        if (csvData !== '') {
          const blob = new Blob([csvData], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          // IE support
          if (navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, 'Hack_Data.csv');
          } else {
            const a = document.createElement('a');
            a.setAttribute('style', 'display: none;');
            a.href = url;
            a.download = 'Hacker_Data.csv';
            document.body.appendChild(a);
            a.click();
            // document.body.removeChild(a);
          }
          window.URL.revokeObjectURL(url);
        }
      },
    });
  }

  /**
   * Changes the selected hackathon view
   */
  changeSelectedHackathon() {
    if (this.selectedHackathon) {
      this.refreshData(this.selectedHackathon);
    } else {
      this.refreshData();
    }
  }

  /**
   * Conversion from one numerical base to another numerical base
   *
   * @param: str  String representing the number
   * @param: fromBase Number representing the base to convert from
   * @param: toBase  Number representing the base to conver to
   */
  convertFromBaseToBase(str: string, fromBase: number, toBase: number) {
    if (str == null) {
      return 'N/A';
    }
    const num = parseInt(str, fromBase);
    return num.toString(toBase);
  }

  /**
   * Returns the status of a hacker for Pre-Registration, Registration, RSVP, and Check-In
   *
   * @param hacker Hacker Information
   * @param status Hacker Status
   */
  checkHackerStatus(hacker, status: string) {
    let hs: HackerStatus;
    switch (status) {
    case 'PreReg': hs = HackerStatus.PreReg; break;
    case 'Reg': hs = HackerStatus.Reg; break;
    case 'RSVP': hs = HackerStatus.RSVP; break;
    case 'CheckIn': hs = HackerStatus.CheckIn; break;
    default: hs = HackerStatus.NULL;
  }
    if (hs !== HackerStatus.NULL) {
    return !!hacker[hs];
  }
    return false;
  }

  /**
   * Changes hacker status to checked in
   *
   * @param: hacker  Hacker Information from the datasource
   */
  onClickCheckedIn(hacker) {
    hacker.check_in_status = true;
    this.adminService.setHackerCheckedIn(hacker.uid)
        .subscribe(() => {},
                   (error) => {
                     hacker.check_in_status = false;
                     this.errors = new Error('Error: Issue with manually checking hacker in');
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
          resp.privilege > 3 ? this.canEditHackerData = true : this.canEditHackerData = false;
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
  updateStatHeader(hackathonUid ?: string) {
    this.adminService.getAllHackerCount(hackathonUid).subscribe((data) => {
    this.preRegStatNumber = data.preregistration_count;
    this.regStatNumber = data.registration_count;
    this.rsvpStatNumber = data.rsvp_count;
    this.checkInStatNumber = data.checkin_count;
  },                                                          (error) => {
    this.errors = new Error('Error: Issue with getting the number of hackers');
    console.error(error);
  });
  }

  /**
   * Opens a modal for displaying more single hacker information, located in ViewUserDataDialog.ts
   *
   * @param: hacker  Hacker Information
   */
  viewAdditionalHackerData(hacker: IHackathonModel) {
    const editPermission = this.canEditHackerData;
    const dt = { editPermission, hacker };
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
          this.alertsService.success('Updated Hacker Information for ' +  hacker_name);
          this.refreshData();
        },         (err) => {
          console.log(err);
          this.alertsService.danger('There was an issue with updating Hacker Information');
        });
    }
  })
  }
}
