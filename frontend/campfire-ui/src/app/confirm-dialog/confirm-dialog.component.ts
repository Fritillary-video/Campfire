import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  message: string;
  buttonText: {
    ok: string;
    cancel: string;
  };
}

@Component({
  template: `
    <h2 mat-dialog-title>{{data.message}}</h2>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancelClick()">{{data.buttonText.cancel}}</button>
      <button mat-button cdkFocusInitial (click)="onOkClick()">{{data.buttonText.ok}}</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onOkClick(): void {
    this.dialogRef.close(true);
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }
}
