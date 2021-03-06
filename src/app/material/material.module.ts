import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';

const material = [
	MatFormFieldModule,
	MatInputModule,
	MatCheckboxModule,
	MatButtonModule,
	MatCardModule,
	MatSnackBarModule,
	MatIconModule,
	MatToolbarModule,
	MatProgressSpinnerModule,
	MatSidenavModule,
	MatListModule,
	MatTableModule,
	MatMenuModule,
	MatDividerModule,
	MatExpansionModule,
	MatDialogModule,
	MatGridListModule,
	MatBadgeModule,
	MatSelectModule,
	MatAutocompleteModule,
	MatProgressBarModule,
	MatChipsModule,
	MatSlideToggleModule,
	MatTreeModule,
	MatTooltipModule,
	MatBottomSheetModule
];

@NgModule({
	imports: [material],
	exports: [material]
})
export class MaterialModule { }
