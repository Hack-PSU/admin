import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { CheckoutInstanceModel } from '../../models/checkout-instance-model';
import { PRIVILEGE_LEVEL } from '../../models/privilege-model';
import { HttpAdminService } from '../../services/services';
import {
  MatBottomSheet,
  MatDialog,
  MatPaginator,
  MatSnackBar,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstants } from '../../helpers/AppConstants';
import { ItemCheckoutModel } from '../../models/item-checkout-model';
import { AddCheckoutRequestDialogComponent } from './add-checkout-request-dialog.component';
import { ReturnCheckoutSheetComponent } from './return-checkout-sheet.component';

@Component({
  selector: 'app-item-checkout',
  templateUrl: './item-checkout.component.html',
  styleUrls: ['./item-checkout.component.css'],
})
export class ItemCheckoutComponent implements OnInit, AfterViewInit {

  private static _regCols =
    [
      'item_name',
      'item_availability',
      'item_quantity',
      'button',
    ];

  private static _returnCols =
    [
      'user_name',
      'item_name',
      'checkout_time',
      'return_time',
      'button',
    ];

  public dataSource: MatTableDataSource<ItemCheckoutModel>;
  public returnDataSource: MatTableDataSource<CheckoutInstanceModel>;

  public directorPermission: Observable<boolean>;
  public displayedColumns = ItemCheckoutComponent._regCols;
  public displayedReturnColumns = ItemCheckoutComponent._returnCols;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) table: MatSort;
  @ViewChild(MatPaginator) returnPaginator: MatPaginator;
  @ViewChild(MatSort) returnTable: MatSort;

  constructor(
    private httpService: HttpAdminService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private matSheet: MatBottomSheet,
    private _router: Router,
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.returnDataSource = new MatTableDataSource<CheckoutInstanceModel>([]);
    this.directorPermission = httpService.getAdminStatus()
      .pipe(
        map((adminData: { admin: boolean, privilege: Number }) =>
          (adminData.privilege >= PRIVILEGE_LEVEL.DIRECTOR
          )),
        take(1),
      );
  }

  ngOnInit() {
    this.activatedRoute.data
      .subscribe((user) => {
        if (user) {
          this.httpService.getAvailableCheckoutItems()
            .subscribe((items: ItemCheckoutModel[]) => {
              this.dataSource.data = this.dataSource.data.concat(items);
            });
          this.httpService.getCurrentCheckedOutItems()
            .subscribe((items: CheckoutInstanceModel[]) => {
              this.returnDataSource.data = items;
            })
        } else {
          this._router.navigate([AppConstants.LOGIN_ENDPOINT]);
        }
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

    this.returnDataSource.paginator = this.returnPaginator;
    this.returnDataSource.sort = this.returnTable;
  }

  refreshData() {
    this.httpService.getAvailableCheckoutItems()
      .subscribe((items: ItemCheckoutModel[]) => {
        this.dataSource.data = items;
      });
  }

  refreshReturnData() {
    this.httpService.getCurrentCheckedOutItems()
      .subscribe((items: CheckoutInstanceModel[]) => {
        this.returnDataSource.data = items;
      });
  }

  addCheckoutItem() {
    // TODO: implement
  }

  newCheckoutRequest(item: ItemCheckoutModel) {
    const dialogRef = this.dialog.open(AddCheckoutRequestDialogComponent, {
      width: '400px',
      data: item,
    });
    dialogRef
      .afterClosed()
      .pipe(
        switchMap((result: string) => {
          if (result) {
            return this.httpService.addCheckoutRequest(item.uid.toString(), result);
          }
          return of(null);
        }),
      )
      .subscribe(() => {
        this.snackBar.open('success', null, {
          duration: 2000,
        });
      },         (error) => {
        this.snackBar.open(error.body, null, {
          duration: 2000,
        });
      });
  }

  applyFilter(value) {
    this.dataSource.filter = value;
  }

  applyEmailFilter(value: any) {
    this.returnDataSource.filter = value;
  }

  returnItem(item: CheckoutInstanceModel) {
    this.matSheet.open(ReturnCheckoutSheetComponent, {
      data: item,
    })
      .afterDismissed()
      .subscribe(() => {
        this.refreshReturnData();
        this.snackBar.open('success', null, {
          duration: 2000,
        });
      });
  }
}
