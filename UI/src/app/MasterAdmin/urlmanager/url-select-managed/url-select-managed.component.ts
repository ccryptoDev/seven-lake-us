import { Component, Input } from "@angular/core";
import URL_OPTIONS from "src/app/constants/urlOptions";
import { URLSelectComponent } from "../url-select/url-select.component";

@Component({
	selector: 'url-select-managed',
	templateUrl: './url-select-managed.component.html',
  styleUrls: ['./url-select-managed.component.scss']
})
export class URLSelectManagedComponent extends URLSelectComponent {
	@Input() urlId: string;
	@Input() onUpdate: (id: string, values: string[]) => void;
	@Input() values: string[] = [] 
	options = URL_OPTIONS

	onSelect(event: Event) {
		const updated = this.getSelected(event)
		this.onUpdate(this.urlId, updated)
	}
}
