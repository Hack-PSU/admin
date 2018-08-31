/**
 * TODO: Add docstring explaining component
 */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';

import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';

import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { AddLocationDialogComponent } from './add-location-dialog';
import { UpdateLocationDialogComponent } from './update-location-dialog';

@Component({
  selector: 'app-manage-locations',
  providers: [
    HttpAdminService,
  ],
  templateUrl: './manage-locations.component.html',
  styleUrls: ['./manage-locations.component.css'],
})

export class ManageLocationsComponent implements OnInit, AfterViewInit {
  private static regCols = [/*'select',*/ 'location_name', 'uid', 'button'];
  displayedColumns = ManageLocationsComponent.regCols;
  public dataSource = new MatTableDataSource<any>([]);
  private user: firebase.User;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) table: MatSort;

  constructor(
    public adminService: HttpAdminService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((user) => {
      if (user) {
        this.onLocationClick();
      } else {
        console.error('NO USER');
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.table;
  }

  applyFilter(filterValue: string) {
    let mFilterValue = filterValue.trim();
    mFilterValue = mFilterValue.toLowerCase();
    this.dataSource.filter = mFilterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onLocationClick() {
    this.adminService.getLocations().subscribe((data) => {
      this.displayedColumns = ManageLocationsComponent.regCols;
      this.dataSource.data = data;
    },                                                  (error) => {
      console.error(error);
    });
  }

  showInsertDialog() {
    const dialogRef = this.dialog.open(AddLocationDialogComponent, {
      height: '240px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);
      this.insertLocation(result);
    },                                (error) => {
      this.openSnackBar('Error: Failed to record location', '');
    });
  }

  insertLocation(locationValue: string) {
    const mLocationValue = locationValue.trim();
    // console.log(mLocationValue);
    this.adminService.addNewLocation(mLocationValue).subscribe((resp) => {
      this.refreshData();
      this.openSnackBar('Success: Inserted new location', '');
    },                                                                    (error) => {
      console.error(error);
      this.openSnackBar('Error: Failed to insert location', '');
    });
  }

  removeLocation(uid: string) {
    // console.log(uid);
    this.adminService.removeLocation(uid).subscribe((resp) => {
      this.refreshData();
      this.openSnackBar('Success: Removed location', '');
    },                                                         (error) => {
      console.error(error);
      this.openSnackBar('Error: Failed to remove location', '');
    });
  }

  showUpdateDialog(uid: string) {
    const dialogRef = this.dialog.open(UpdateLocationDialogComponent, {
      height: '240px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateLocation(result, uid);
      }
    },                                (error) => {
      this.openSnackBar('Error: Failed to record location', '');
    });
  }

  updateLocation(locationValue: string, uid: string) {
    const mLocationValue = locationValue.trim();
    console.log(mLocationValue);
    this.adminService.updateLocation(uid, mLocationValue).subscribe((resp) => {
      this.refreshData();
      this.openSnackBar('Success: Updated location', '');
    },                                                                         (error) => {
      console.error(error);
      this.openSnackBar('Error: Failed to update location', '');
    });
  }

  refreshData() {
    this.onLocationClick();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}

