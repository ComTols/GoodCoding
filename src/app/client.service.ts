import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { retry } from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})
export class ClientService {

	private url: string = "http://80.151.1.57:1180/api.php";
	private connectionRetry: number = 5;

	constructor(
		private snackBar: MatSnackBar,
		private http: HttpClient
	) {
	}

	public openSnackBar(message: string, action: string) {
		this.snackBar.open(message, action);
	}

	public sendDataToServerApi(action: string) {
		const body = {
			'action': action,
			'user': localStorage.getItem("username"),
			'pass': localStorage.getItem("password")
		}
		return this.http.post(this.url, body).pipe(retry(this.connectionRetry));
	}
}