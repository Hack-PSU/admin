import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-user-class-dialog',
  templateUrl: './add-user-class-dialog.html',
  styleUrls: ['./add-user-class-dialog.css'],
})
export class AddUserClassDialogComponent {

  constructor(public dialogRef: MatDialogRef<AddUserClassDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
