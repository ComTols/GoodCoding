import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})
export class ClientService {

	private url: string = "https://goodcoding.marianum-fulda.de/api.php";
	//private url: string = "http://localhost/test.php";

	private connectionRetry: number = 5;

	constructor(
		private snackBar: MatSnackBar,
		private http: HttpClient
	) {
	}

	public openSnackBar(message: string, action: string) {
		this.snackBar.open(message, action);
	}

	public sendDataToServerApi(action: string): Observable<Object> {
		const body = {
			'action': action,
			'user': localStorage.getItem("username"),
			'pass': localStorage.getItem("password"),
			'cours': localStorage.getItem("cours")
		}
		return this.http.post(this.url, body).pipe(retry(this.connectionRetry));
	}

	public sendDataToServerApiWithData(action: string, data: {}): Observable<Object> {
		const body = {
			'action': action,
			'user': localStorage.getItem("username"),
			'pass': localStorage.getItem("password"),
			'cours': localStorage.getItem("cours"),
			'data': data
		}
		return this.http.post(this.url, body).pipe(retry(this.connectionRetry));
	}
}