import { Component, Input } from "@angular/core";

@Component({
	templateUrl: 'document-preview.component.html',
	styleUrls: ['document-preview.component.scss'],
	selector: 'document-preview',
})
export class DocumentPreviewComponent {
	@Input() src: string;
	@Input() id: string;
}