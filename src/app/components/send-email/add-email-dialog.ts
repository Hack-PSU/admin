import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-email-dialog',
  templateUrl: './add-email-dialog.html',
  styleUrls: ['./add-email-dialog.css'],
})
export class AddEmailDialogComponent {

  public outData: any;

  constructor(public dialogRef: MatDialogRef<AddEmailDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.outData = {};
    data.forEach(d => this.outData[d] = '');
  }
}
