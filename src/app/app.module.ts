import { ClientService } from './client.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { StorageChartComponent } from './dashboard/storage-chart/storage-chart.component';
import { DatabaseChartComponent } from './dashboard/database-chart/database-chart.component';
import { ParticlesModule } from 'angular-particle';
import { RenameDialogComponent } from './files/rename-dialog/rename-dialog.component';
import { DelDialogComponent } from './files/del-dialog/del-dialog.component';
import { MoveDialogComponent } from './files/move-dialog/move-dialog.component';
import { AddClassDialogComponent } from './admin-sverw/admin-sverw.component';
import { WaitComponent } from './wait/wait.component';
import { EditUserComponent } from './admin-sverw/edit-user/edit-user.component';
import { NewUserComponent } from './admin-sverw/new-user/new-user.component';
import { AllowUserComponent } from './admin-sverw/allow-user/allow-user.component';

@NgModule({
	declarations: [
		AppComponent,
		FooterBarComponent,
		StorageChartComponent,
		DatabaseChartComponent,
		RenameDialogComponent,
		DelDialogComponent,
		MoveDialogComponent,
		AddClassDialogComponent,
		routingComponents,
		WaitComponent,
		EditUserComponent,
		NewUserComponent,
		AllowUserComponent
	],
	entryComponents: [RenameDialogComponent, DelDialogComponent, MoveDialogComponent, AddClassDialogComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MaterialModule,
		ReactiveFormsModule,
		ChartsModule,
		ParticlesModule
	],
	providers: [ClientService, CookieService],
	bootstrap: [AppComponent]
})
export class AppModule { }
