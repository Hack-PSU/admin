/**
 * TODO: Add docstring explaining component
 */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';

import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';

import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstants } from '../../helpers/AppConstants';
import { EmailListService } from '../../services/email-list/email-list.service';

@Component({
  selector: 'app-registration-table',
  providers: [
    HttpAdminService,
  ],
  templateUrl: './registration-table.component.html',
  styleUrls: ['./registration-table.component.css'],
})

export class RegistrationTableComponent implements OnInit, AfterViewInit {
  private static regCols = ['select', 'firstname', 'lastname', 'email', 'university', 'academic_year',
    'gender', 'coding_experience',
    'major', 'shirt_size', 'dietary_restriction', 'allergies', 'travel_reimbursement', 'veteran',
    'first_hackathon', 'race', 'expectations', 'project', 'referral', 'resume', 'pin', 'uid'];

  public displayedColumns = RegistrationTableComponent.regCols;
  public dataSource = new MatTableDataSource<any>([]);
  public selection = new SelectionModel<any>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) table: MatSort;

  constructor(
    public adminService: HttpAdminService,
    public activatedRoute: ActivatedRoute,
    public emailListService: EmailListService,
    private router: Router,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((user) => {
      if (user) {
        this.onRegistrationClick();
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

  onRegistrationClick() {
    this.adminService.getRegistrations().subscribe((data) => {
      this.displayedColumns = RegistrationTableComponent.regCols;
      this.dataSource.data = data;
    },                                                       (error) => {
      console.error(error);
      this.openSnackBar('Error: Failed to load data', '');
    });
  }

  sendEmail() {
    this.emailListService.emailList = this.selection.selected;
    this.router.navigate([AppConstants.EMAIL_ENDPOINT])
      .catch(e => console.error(e));
  }

  refreshData() {
    this.onRegistrationClick();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  convertFromBaseToBase(str, fromBase, toBase) {
    const num = parseInt(str, fromBase); // convert from one base to another
    return num.toString(toBase);
  }
}
