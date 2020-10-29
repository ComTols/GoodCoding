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

	loginForm = new FormGroup({
		username: new FormControl(null, [Validators.required, Validators.minLength(3)]),
		password: new FormControl(null, Validators.required),
		autoLogin: new FormControl()
	});

	constructor(
		private router: Router,
		private service: ClientService,
	) { }

	async sendLogin() {
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

		this.service.setLoginData(this.loginForm.value['username'], this.loginForm.value['password']);

		var data = this.service.validLoginData(this);

	}

	ngOnInit() {
		this.service.validLoginData(this);
	}

	public serverFinish(answer) {
		console.log(answer);

		if (answer != null) {
			this.accesControll(answer["acces"]);
			console.log("Login Data Valid!");
		} else {
			console.log("Login Data Invalid!");
		}
	}

	private accesControll(acces: string) {
		if (acces != null) {
			if (acces == "denied") {
				this.loginForm.controls["password"].reset();
				this.isPasswordValid = true;
				this.isUsernameValid = true;
				this.loginFaild = true;
				this.service.openSnackBar("Bitte überprüfen Sie Ihre Eingabe! Die Kombination aus Benutzername und Passwort existiert nicht.", "Okay");
			}
			if (acces == "permitted") {
				this.loginFaild = false;
				this.service.setPassword(this.loginForm.value['password']);
				this.service.setUsername(this.loginForm.value['username']);
				console.log("Zugang gewährt. Weiterleitung...");

				this.router.navigate(["/dashboard"]);
			}
			if (acces == "admin") {
				this.loginFaild = false;
				this.service.openSnackBar("Eingabe akzeptiert! Adminrechte zugewiesen.", "Okay");
			}
		}
	}

}
