import { NgModule } from '@angular/core';
import {
  MatButtonModule, MatFormFieldModule, MatInputModule, MatSidenavModule, MatTableModule, MatTabsModule,
  MatTooltipModule, MatSelectModule, MatIconModule, MatSortModule, MatCheckboxModule, MatProgressBarModule,
  MatCardModule,
  MatDialogModule, MatExpansionModule,
  MatListModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatToolbarModule,
  MatGridListModule, MatSnackBarModule,
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    MatToolbarModule, MatCardModule, MatDialogModule, MatStepperModule, MatListModule, MatMenuModule, MatIconModule, MatSidenavModule,
    MatProgressBarModule, MatTabsModule, MatTableModule, MatFormFieldModule, MatButtonModule, MatInputModule, NoopAnimationsModule, MatPaginatorModule,
    MatTooltipModule, MatSelectModule, MatSortModule, MatCheckboxModule, MatExpansionModule, MatGridListModule,MatSlideToggleModule,MatSnackBarModule,
  ],
  exports: [
    MatToolbarModule, MatCardModule, MatDialogModule, MatStepperModule, MatListModule, MatMenuModule, MatIconModule,
    MatProgressBarModule, MatSidenavModule, MatTabsModule, MatTableModule, MatFormFieldModule, MatButtonModule, MatInputModule, NoopAnimationsModule,
    MatPaginatorModule, MatTooltipModule, MatSelectModule, MatSortModule, MatCheckboxModule, MatExpansionModule, MatGridListModule,MatSlideToggleModule, MatSnackBarModule
  ],
})
export class CustomMaterialModule {
}
