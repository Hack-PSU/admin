import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-location-dialog',
  templateUrl: './add-location-dialog.html',
  styleUrls: ['./add-location-dialog.css'],
})
export class AddLocationDialogComponent {

  constructor(public dialogRef: MatDialogRef<AddLocationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
