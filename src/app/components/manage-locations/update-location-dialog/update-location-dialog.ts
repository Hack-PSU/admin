import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-update-location-dialog',
  templateUrl: './update-location-dialog.html',
  styleUrls: ['./update-location-dialog.css'],
})
export class UpdateLocationDialogComponent {
  private passed_data: string;
  constructor(public dialogRef: MatDialogRef<UpdateLocationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.passed_data = data;
  }

  /**
   * On clicking off the dialog, close the dialog
   */
  onNoClick(): void {
    this.dialogRef.close();
  }
}
