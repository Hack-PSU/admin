/**
 * TODO: Add docstring explaining component
 */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';

import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';

import { SelectionModel } from '@angular/cdk/collections';
import { AddUserClassDialogComponent } from './add-user-class-dialog/add-user-class-dialog';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-extra-credit-classes',
  providers: [
    HttpAdminService,
  ],
  templateUrl: './extra-credit-classes.component.html',
  styleUrls: ['./extra-credit-classes.component.css'],
})
export class ExtraCreditClassesComponent implements OnInit, AfterViewInit {
  private static regCols = ['select', 'class_name', 'uid'];
  displayedColumns = ExtraCreditClassesComponent.regCols;
  public dataSource = new MatTableDataSource<any>([]);
  private user: firebase.User;
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) table: MatSort;

  constructor(
    public adminService: HttpAdminService,
    public afAuth: AngularFireAuth,
    public dialog: MatDialog,
    public alertsService: AlertService,
  ) {
  }

  ngOnInit() {
    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user;
        this.onClassesClick();
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

  onClassesClick() {
    this.adminService.getExtraCreditClasses()
        .subscribe((data) => {
          this.displayedColumns = ExtraCreditClassesComponent.regCols;
          this.dataSource.data = data;
        },         (error) => {
          console.error(error);
        });
  }

  refreshData() {
    this.onClassesClick();
  }

  addUserToClasses() {
    const dialogRef = this.dialog.open(AddUserClassDialogComponent, {
      height: '240px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.getUserUID(result)
            .subscribe((resp: {uid: string}) => {
              console.log(resp);
              this.selection.selected.forEach(({ uid }) => {
                console.log(uid);
                console.log(resp.uid);
                this.adminService.addHackerToExtraCreditClass(resp.uid, uid)
                .subscribe((rest) => {
                  this.alertsService.success('Success: Added Hacker');
                },         (error) => {
                  console.error(error);
                  this.alertsService.danger('Error: Failed to add Hacker');
                });
              });
            },         (error) => {
              console.error(error);
              this.alertsService.warning('Error: Issue with the provided Email');
            });
      }
    });
  }
}

