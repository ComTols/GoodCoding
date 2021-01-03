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
import { DeleteDialogComponent } from './admin-sverw/dialogs/delete-dialog/delete-dialog.component';
import { LockDialogComponent } from './admin-sverw/dialogs/lock-dialog/lock-dialog.component';
import { PermittAdminDialogComponent } from './admin-sverw/dialogs/permitt-admin-dialog/permitt-admin-dialog.component';
import { EditorComponent } from './files/editor/editor.component';
import { AceEditorModule } from 'ng2-ace-editor';
import { AceModule } from 'ngx-ace-wrapper';
import { ACE_CONFIG } from 'ngx-ace-wrapper';
import { AceConfigInterface } from 'ngx-ace-wrapper';
import { FiletreeComponent } from './files/editor/filetree/filetree.component';
import { LogoutComponent } from './logout/logout.component';

const DEFAULT_ACE_CONFIG: AceConfigInterface = {
};

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
		AllowUserComponent,
		DeleteDialogComponent,
		LockDialogComponent,
		PermittAdminDialogComponent,
		EditorComponent,
		FiletreeComponent,
		LogoutComponent
	],
	entryComponents: [RenameDialogComponent, DelDialogComponent, MoveDialogComponent, AddClassDialogComponent, DeleteDialogComponent, LockDialogComponent, PermittAdminDialogComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MaterialModule,
		ReactiveFormsModule,
		ChartsModule,
		ParticlesModule,
		AceModule
	],
	providers: [ClientService, CookieService, {
		provide: ACE_CONFIG,
		useValue: DEFAULT_ACE_CONFIG
	}],
	bootstrap: [AppComponent]
})
export class AppModule { }
