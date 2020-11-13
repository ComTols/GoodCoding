import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminSverwComponent } from './admin-sverw/admin-sverw.component';
import { AllComponent } from './all/all.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FaqComponent } from './faq/faq.component';
import { FilesComponent } from './files/files.component';
import { ImprintComponent } from './imprint/imprint.component';
import { LoginComponent } from './login/login.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [{
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
}];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
	DashboardComponent,
	LoginComponent,
	PrivacyComponent,
	ImprintComponent,
	FilesComponent,
	FaqComponent,
	AllComponent,
	SettingsComponent,
	ContactComponent,
	AdminDashboardComponent,
	AdminSverwComponent,
	AllComponent
];
