import { ClientService } from './client.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { CookieService } from 'ngx-cookie-service';
import { FooterBarComponent } from './footer-bar/footer-bar.component';
import { StorageChartComponent } from './dashboard/storage-chart/storage-chart.component';
import { DatabaseChartComponent } from './dashboard/database-chart/database-chart.component';
import { ParticlesModule } from 'angular-particle';
import { PrivacyComponent } from './privacy/privacy.component';
import { ImprintComponent } from './imprint/imprint.component';
import { FilesComponent } from './files/files.component';
import { FaqComponent } from './faq/faq.component';
import { RenameDialogComponent } from './files/rename-dialog/rename-dialog.component';
import { DelDialogComponent } from './files/del-dialog/del-dialog.component';
import { MoveDialogComponent } from './files/move-dialog/move-dialog.component';
import { AllComponent } from './all/all.component';
import { SettingsComponent } from './settings/settings.component';
import { ContactComponent } from './contact/contact.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminSverwComponent } from './admin-sverw/admin-sverw.component';

const routen: Routes = [
	{
		path: 'dashboard',
		component: DashboardComponent
	}, {
		path: '',
		component: LoginComponent
	}, {
		path: 'privacy',
		component: PrivacyComponent
	}, {
		path: 'imprint',
		component: ImprintComponent
	}, {
		path: 'files',
		component: FilesComponent
	}, {
		path: 'faq',
		component: FaqComponent
	}, {
		path: 'all',
		component: AllComponent
	}, {
		path: 'settings',
		component: SettingsComponent
	}, {
		path: 'contact',
		component: ContactComponent
	}, {
		path: 'admin/dashboard',
		component: AdminDashboardComponent
	}, {
		path: 'admin/sverw',
		component: AdminSverwComponent
	}, {
		path: 'admin/all',
		component: AllComponent
	}
];

@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		LoginComponent,
		FooterBarComponent,
		StorageChartComponent,
		DatabaseChartComponent,
		PrivacyComponent,
		ImprintComponent,
		FilesComponent,
		FaqComponent,
		RenameDialogComponent,
		DelDialogComponent,
		MoveDialogComponent,
		AllComponent,
		SettingsComponent,
		ContactComponent,
		AdminDashboardComponent,
		AdminSverwComponent
	],
	entryComponents: [RenameDialogComponent, DelDialogComponent, MoveDialogComponent],
	imports: [
		RouterModule.forRoot(routen),
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
