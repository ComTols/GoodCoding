import { ClientService } from './../client.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	hide = true;
	isPasswordValid = true;
	isUsernameValid = true;
	loginFaild = false;
	awaitingServerResponse: boolean = false;
	loginUserData = {};

	loginForm = new FormGroup({
		username: new FormControl(null, [Validators.required, Validators.minLength(3)]),
		password: new FormControl(null, Validators.required),
		autoLogin: new FormControl()
	});

	constructor(
		private router: Router,
		private service: ClientService,
	) { }

	sendLogin() {
		if (this.loginForm.status != "VALID") {
			if (this.loginForm.controls["username"].status != "VALID") {
				this.isUsernameValid = false;
			} else {
				this.isUsernameValid = true;
			}
			if (this.loginForm.controls["password"].status != "VALID") {
				this.isPasswordValid = false;
			} else {
				this.isPasswordValid = true;
			}
			this.service.openSnackBar("Bitte überprüfen Sie Ihre Eingabe! Ein Feld ist nicht korrekt ausgefüllt!", "Okay");
			return;
		}

		//this.service.setLoginData(this.loginForm.value['username'], this.loginForm.value['password']);
		localStorage.setItem("username", this.loginForm.value['username']);
		localStorage.setItem("password", this.loginForm.value['password']);
		this.awaitingServerResponse = true;
		//this.service.validLoginData(this);
		this.service.sendDataToServerApi('userLogin').subscribe(
			res => {
				this.awaitingServerResponse = true;
				if (res["acces"] == "denied") {
					this.service.openSnackBar("Bitte überprüfen Sie Ihre Eingabe! Die Kombination aus Benutzername und Passwort existiert nicht.", "Okay");
					this.loginForm.controls["password"].reset();
					this.isPasswordValid = true;
					this.isUsernameValid = true;
					this.loginFaild = true;
				} else if (res["acces"] == "permitted") {
					console.log("Zugang gewährt");
					this.loginFaild = false;
					this.router.navigate(["/dashboard"]);
				} else if (res["acces"] == "admin") {
					console.log("Zugang akzeptiert! Adminrechte zugewiesen.");
					this.loginFaild = false;
					//TODO: Weiterleitung zu Admin-Bereich
				}
			},
			err => {
				this.awaitingServerResponse = true;
				console.log(err);
				this.service.openSnackBar("Der Server antwortet nicht. Bitte wenden Sie sich an einen Administrator!", "Okay");
			}
		);
	}

	ngOnInit() {

	}



}
