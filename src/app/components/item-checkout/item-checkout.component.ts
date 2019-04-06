import { AfterViewInit, Component, OnInit, ViewChild, QueryList } from '@angular/core';
import {
  MatBottomSheet,
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AppConstants } from '../../helpers/AppConstants';
import { CheckoutInstanceModel } from '../../models/checkout-instance-model';
import { ItemCheckoutModel } from '../../models/item-checkout-model';
import { PRIVILEGE_LEVEL } from '../../models/privilege-model';
import { HttpAdminService } from '../../services/services';
import { AddCheckoutRequestDialogComponent } from './add-checkout-request-dialog/add-checkout-request-dialog.component'
import { ReturnCheckoutSheetComponent } from './return-checkout-sheet.component';
import { IHackerRegistrationModel } from 'app/models/hacker-registration-model';
import { AlertService } from 'ngx-alerts';

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

  public itemDataSource: MatTableDataSource<ItemCheckoutModel>;
  public returnDataSource: MatTableDataSource<CheckoutInstanceModel>;

  public directorPermission: Observable<boolean>;
  public displayedColumns = ItemCheckoutComponent._regCols;
  public displayedReturnColumns = ItemCheckoutComponent._returnCols;

  @ViewChild('itemPaginator') itemPaginator: MatPaginator;
  @ViewChild(MatSort) itemTableSort: MatSort;
  @ViewChild('returnPaginator') returnPaginator: MatPaginator;
  @ViewChild(MatSort) returnTableSort: MatSort;

  constructor(
    private httpService: HttpAdminService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private matSheet: MatBottomSheet,
    private _router: Router,
    public alertsService: AlertService,
  ) {
    this.itemDataSource = new MatTableDataSource([]);
    this.returnDataSource = new MatTableDataSource<CheckoutInstanceModel>([]);
    this.directorPermission = httpService.getAdminStatus()
      .pipe(
        map((data: {admin: boolean, privilege: number}) =>
          (data.privilege >= PRIVILEGE_LEVEL.DIRECTOR
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
              this.itemDataSource.data = items;
            },         (error) => {
              console.log(error);
              this.alertsService.danger('Error: Issue with getting the available checkout items.')
            });
          this.httpService.getCurrentCheckedOutItems()
            .subscribe((items: CheckoutInstanceModel[]) => {
              this.returnDataSource.data = items;
            },         (error) => {
              console.log(error);
              this.alertsService.danger('Error: Issue with getting the current checked out items.')
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
   */
  ngAfterViewInit() {
    this.itemDataSource.paginator = this.itemPaginator;
    this.itemDataSource.sort = this.itemTableSort;

    this.returnDataSource.paginator = this.returnPaginator;
    this.returnDataSource.sort = this.returnTableSort;
  }

  refreshData() {
    this.httpService.getAvailableCheckoutItems()
      .subscribe((items: ItemCheckoutModel[]) => {
        this.itemDataSource.data = items;
      },         (error) => {
        console.log(error);
        this.alertsService.danger('Error: Issue with getting the available checkout items.')
      });
  }

  refreshReturnData() {
    this.httpService.getCurrentCheckedOutItems()
      .subscribe((items: CheckoutInstanceModel[]) => {
        this.returnDataSource.data = items;
      },         (error) => {
        console.log(error);
        this.alertsService.danger('Error: Issue with getting the current checked out items.')
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
        switchMap((result: IHackerRegistrationModel) => {
          if (result) {
            return this.httpService.addCheckoutRequest(parseInt(item.uid, 10), result.uid);
          }
          return of(null);
        }),
      )
      .subscribe((resp) => {
        if (resp) {
          this.refreshData();
          this.alertsService.success('Success! The item has been checked out.');
        }
      },         (error) => {
        console.error(error);
        this.alertsService.danger('Error: There was a problem with checking out the item');
      });
  }

  applyItemFilter(value) {
    this.itemDataSource.filter = value;
  }

  applyReturnFilter(value: any) {
    this.returnDataSource.filter = value;
  }

  returnItem(item: CheckoutInstanceModel) {
    this.matSheet.open(ReturnCheckoutSheetComponent, {
      data: item,
    })
      .afterDismissed()
      .subscribe((resp) => {
        if (resp) {
          this.refreshReturnData();
          this.alertsService.success('Success! The item has been returned.');
        }
      },         (error) => {
        console.error(error);
        this.alertsService.danger('Error: There was a problem with returning the item');
      });
  }

  formatTime(time?: string) {
    if (time) {
      return new Date(parseInt(time, 10)).toLocaleTimeString('nu', { month: 'short', day: 'numeric' });
    }
    return 'N/A';
  }
}
