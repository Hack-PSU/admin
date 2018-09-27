import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { CheckoutInstanceModel } from '../../models/checkout-instance-model';
import { HttpAdminService } from '../../services/services';

@Component({
  selector: 'app-return-checkout-sheet',
  templateUrl: 'return-checkout-sheet.component.html',
})
export class ReturnCheckoutSheetComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<ReturnCheckoutSheetComponent>,
    private httpService: HttpAdminService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: CheckoutInstanceModel,
  ) {}

  dismiss(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  submit(event: MouseEvent): void {
    this.httpService.returnCheckoutItem(this.data)
      .subscribe((result) => {
        this.bottomSheetRef.dismiss(result);
      });
    event.preventDefault();
  }
}
