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
	MatListModule
];

@NgModule({
	imports: [material],
	exports: [material]
})
export class MaterialModule { }
