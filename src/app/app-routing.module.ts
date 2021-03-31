import { LogoutComponent } from './logout/logout.component';
import { EditorComponent } from './files/editor/editor.component';
import { WaitComponent } from './wait/wait.component';
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
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [{
	path: '',
	component: LoginComponent
}, {
	path: 'dashboard',
	component: DashboardComponent
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
}, {
	path: 'wait',
	component: WaitComponent
}, {
	path: 'editor/:path',
	component: EditorComponent
}, {
	path: '404',
	component: NotFoundComponent
}, {
	path: 'logout',
	component: LogoutComponent
}, {
	path: '**',
	redirectTo: '404',
	pathMatch: 'full'
}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
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
	AllComponent,
	EditorComponent,
	LogoutComponent,
	NotFoundComponent
];
