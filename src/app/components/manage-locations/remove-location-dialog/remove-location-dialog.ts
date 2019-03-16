import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-remove-location-dialog',
  templateUrl: './remove-location-dialog.html',
  styleUrls: ['./remove-location-dialog.css'],
})
export class RemoveLocationDialogComponent {

  public passed_data: any;
  constructor(public dialogRef: MatDialogRef<RemoveLocationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.passed_data = data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
