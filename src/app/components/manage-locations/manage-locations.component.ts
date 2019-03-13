/**
 * Component handle the management of locations for events. Users have the ability to view all current
 * locations and edit them with Create/Read/Update/Delete (CRUD) functionality.
 */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';

import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';

import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { AddLocationDialogComponent } from './add-location-dialog/add-location-dialog';
import { UpdateLocationDialogComponent } from './update-location-dialog/update-location-dialog';
import { RemoveLocationDialogComponent } from './remove-location-dialog/remove-location-dialog';
import { LocationModel } from 'app/models/location-model';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-manage-locations',
  providers: [
    HttpAdminService,
  ],
  templateUrl: './manage-locations.component.html',
  styleUrls: ['./manage-locations.component.css'],
})

export class ManageLocationsComponent implements OnInit, AfterViewInit {
  private static regCols = ['location_name', 'uid', 'updateButton', 'removeButton'];
  public displayedColumns = ManageLocationsComponent.regCols;
  public dataSource = new MatTableDataSource<LocationModel>([]);
  private user: firebase.User;
  public selection = new SelectionModel<any>(true, []);

  /**
   * Error array used to display error messages
   */
  public errors: Error = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) table: MatSort;

  constructor(
    public adminService: HttpAdminService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    public alertsService: AlertService,
    ) {
  }

  /**
   * On the initilization of all angular components, execute the functions
   *
   * Retrieves the locations list and populates the locations table using the http-admin service
   *
   * @exception: Failure on the auth service will cause an error to be displayed in the console
   * @exception: Issue with the user not existing in the auth service database will cause an error to be displayed
   *                 in the console.
   */
  ngOnInit() {
    this.activatedRoute.data.subscribe((user) => {
      if (user) {
        this.getLocations();
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
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.table;
  }

  /**
   * Filters the location table to only include results containing the search string filterValue
   *
   * @param filterValue Search string to filter by
   */
  applyFilter(filterValue: string) {
    let mFilterValue = filterValue.trim();
    mFilterValue = mFilterValue.toLowerCase();
    this.dataSource.filter = mFilterValue;
  }

  /**
   * Checks whether the number of selected elements matches the total number of rows.
   */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /**
   * Selects all rows if they are not all selected; otherwise clear selection.
   */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /**
   * Calls the HTTP service to get the locations in order to populate the table
   *
   * @exception: Failure with the admin service will cause an error to be displayed on the /locations/ route page
   */
  getLocations() {
    this.adminService.getLocations().subscribe((data) => {
      this.displayedColumns = ManageLocationsComponent.regCols;
      this.dataSource.data = data;
    },                                         (error) => {
      console.error(error);
      this.alertsService.danger('Error, Failed to retrieve the locations');
    });
  }

  /**
   * Renders the Add/Insert Location popup dialog
   */
  showInsertDialog() {
    const dialogRef = this.dialog.open(AddLocationDialogComponent, {
      height: '240px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.insertLocation(result);
      }
    },                                (error) => {
      console.log(error);
      this.alertsService.danger('Error with insert location dialog. Please try again');
    });
  }

  /**
   * Adds a new location with the name of Locationvalue
   *
   * @param locationValue Name for the location
   * @exception: Failure with the admin service will cause an error to be displayed on the /locations/ route page
   */
  insertLocation(locationValue: string) {
    const mLocationValue = locationValue.trim();
    this.adminService.addNewLocation(mLocationValue).subscribe((resp) => {
      this.refreshData();
      this.alertsService.success('Success, Inserted new location');
    },                                                         (error) => {
      console.error(error);
      this.alertsService.danger('Error: Failed to insert location');
    });
  }

  /**
   * Renders the Delete/Remove Location popup dialog
   */
  showRemoveDialog(name: string, uid: string) {
    const dialogRef = this.dialog.open(RemoveLocationDialogComponent, {
      height: '200px',
      data: name,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeLocation(uid);
      }
    },                                (error) => {
      console.log(error);
      this.alertsService.danger('Error with insert location dialog. Please try again');
    });
  }

  /**
   * Removes/deletes a location from the database
   *
   * @param uid Unique identifier for the location
   * @exception: Failure with the admin service will cause an error to be displayed on the /locations/ route page
   */
  removeLocation(uid: string) {
    this.adminService.removeLocation(uid).subscribe((resp) => {
      this.refreshData();
      this.alertsService.success('Success, removed a location');
    },                                              (error) => {
      console.error(error);
      this.alertsService.danger('Error, Failed to remove location');
    });
  }

  /**
   * Renders the Update Location popup dialog
   */
  showUpdateDialog(name: string, uid: string) {
    const dialogRef = this.dialog.open(UpdateLocationDialogComponent, {
      height: '300px',
      data: name,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateLocation(result, uid);
      }
    },                                (error) => {
      console.log(error);
      this.alertsService.danger('Error with update location dialog. Please try again');
    });
  }

  /**
   * Updates the Location to have a new name
   *
   * @param locationValue  new name of location
   * @param uid  Unique identifier for the location
   *
   * @exception: Failure with the admin service will cause an error to be displayed on the /locations/ route page
   */
  updateLocation(locationValue: string, uid: string) {
    const mLocationValue = locationValue.trim();
    this.adminService.updateLocation(uid, mLocationValue).subscribe(() => {
      this.refreshData();
      this.alertsService.success('Success, Updated Location!');
    },                                                              (error) => {
      console.error(error);
      this.alertsService.danger(error);
    });
  }

  /**
   * Abstraction method for refreshing the datatable and pulling the location data from the API
   */
  refreshData() {
    this.getLocations();
  }
}

