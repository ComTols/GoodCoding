import { Component, OnInit, ViewChild } from '@angular/core';
import 'brace';
import 'brace/ext/language_tools'
import 'brace/mode/text';
import 'brace/mode/html';
import 'brace/theme/twilight';
import 'brace/theme/github';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

	config: any = {
		printMargin: false,
		enableBasicAutocompletion: true,
		enableLiveAutocompletion: true
	};
	value = "text";
	theme = "twilight"
	mode = "html";
	languages: { value: string, text: string }[] = [{
		value: "html",
		text: "HTML"
	}]

	constructor() { }

	ngOnInit(): void {
	}

	onChange(event) {
		console.log(event);

	}

	onClickButton() {
		this.theme = "github";
	}

}
