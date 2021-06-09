import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    MatToolbarModule, MatCardModule, MatDialogModule, MatStepperModule, MatListModule,
    MatMenuModule, MatIconModule, MatSidenavModule,
    MatProgressBarModule, MatTabsModule, MatTableModule, MatFormFieldModule,
    MatButtonModule, MatInputModule, NoopAnimationsModule, MatPaginatorModule,
    MatTooltipModule, MatSelectModule, MatSortModule, MatCheckboxModule,
    MatExpansionModule, MatGridListModule, MatSlideToggleModule, MatSnackBarModule,
    MatAutocompleteModule, MatBottomSheetModule,
  ],
  exports: [
    MatToolbarModule, MatCardModule, MatDialogModule, MatStepperModule, MatListModule,
    MatMenuModule, MatIconModule,
    MatProgressBarModule, MatSidenavModule, MatTabsModule, MatTableModule,
    MatFormFieldModule, MatButtonModule, MatInputModule, NoopAnimationsModule,
    MatPaginatorModule, MatTooltipModule, MatSelectModule, MatSortModule,
    MatCheckboxModule, MatExpansionModule, MatGridListModule, MatSlideToggleModule,
    MatSnackBarModule, MatAutocompleteModule, MatBottomSheetModule,
  ],
})
export class CustomMaterialModule {
}
