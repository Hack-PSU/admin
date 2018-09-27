import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { ItemCheckoutModel } from '../../models/item-checkout-model';
import { HttpAdminService } from '../../services/services';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-add-checkout-request-dialog',
  templateUrl: './add-checkout-request-dialog.component.html',
  styleUrls: ['./add-checkout-request-dialog.component.css'],
})
export class AddCheckoutRequestDialogComponent {

  private static readonly emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public searchEmail: string;
  public searchTerm$: Subject<string>;
  searchResults: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<AddCheckoutRequestDialogComponent>,
    private httpService: HttpAdminService,
    @Inject(MAT_DIALOG_DATA) public data: ItemCheckoutModel,
  ) {
    this.searchTerm$ = new Subject();
    const checker = new RegExp(AddCheckoutRequestDialogComponent.emailRegex);
    this.searchResults = this.searchTerm$.asObservable()
      .pipe(
        filter(searchTerm => checker.test(searchTerm)),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => this.httpService.getUserUID(search)),
      );
  }

  submitCheckoutRequest(result) {

  }
}
