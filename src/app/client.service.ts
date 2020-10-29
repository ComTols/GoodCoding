import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { retry } from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})
export class ClientService {

	private password: string;
	private username: string;
	private isLoginDataSet: boolean;
	private lasServerResp;
	public connectionFaildRetry: number = 5;

	constructor(
		private snackBar: MatSnackBar,
		private cookie: CookieService,
		private client: HttpClient,
	) {
		this.checkCookieForLoginData();
	}

	public openSnackBar(message: string, action: string) {
		this.snackBar.open(message, action);
	}

	public getPassword(): string {
		return this.password;
	}

	public setPassword(pass: string) {
		this.password = pass;
		this.cookie.set("password", pass);
	}
	public getUsername(): string {
		return this.username;
	}
	public setUsername(user: string) {
		this.username = user;
		this.cookie.set("username", user);
	}
	public setLoginData(user: string, pass: string) {
		this.setUsername(user);
		this.setPassword(pass);
	}
	public checkCookieForLoginData(): boolean {
		if (this.cookie.check("username")) {
			this.username = this.cookie.get("username");
		}
		if (this.cookie.check("password")) {
			this.password = this.cookie.get("password")
		}
		if (this.cookie.check("username") && this.cookie.check("password")) {
			this.isLoginDataSet = true;
		} else {
			this.isLoginDataSet = false;
		}
		return this.isLoginDataSet;
	}
	public getIsLoginDataSet(): boolean {
		console.log("pass " + this.password);

		this.checkCookieForLoginData();
		if (this.username == null || this.username == "null" || this.username == "" || this.username == undefined || this.password == null || this.password == "null" || this.password == "" || this.password == undefined) {
			this.isLoginDataSet = false;
		} else {
			this.isLoginDataSet = true;
		}
		return this.isLoginDataSet;
	}

	public async sendDataToServerApi(body) {
		await this.client.post("http://80.151.1.57:1180/api.php", body).pipe(retry(this.connectionFaildRetry)).subscribe(data => {
			this.lasServerResp = data;
		}, error => {
			this.lasServerResp = null;
			console.log(error);
			console.log(body);
			this.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
		});
	}

	private sendLoginDataToServerApi(body, parent) {
		this.client.post("http://80.151.1.57:1180/api.php", body).pipe(retry(this.connectionFaildRetry)).subscribe(data => {
			this.lasServerResp = data;
			parent.serverFinish(data);
		}, error => {
			this.lasServerResp = null;
			console.log(error);
			console.log(body);
			this.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
		});
	}

	public validLoginData(parent) {
		if (this.getIsLoginDataSet()) {
			console.log("Data is set.");

			const body = {
				'action': 'userLogin',
				'user': this.username,
				'pass': this.password,
			};
			this.sendLoginDataToServerApi(body, parent);
		}
	}
}
