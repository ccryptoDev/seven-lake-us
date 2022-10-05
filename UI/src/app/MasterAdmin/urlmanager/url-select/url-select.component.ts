import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";

@Component({
	selector: 'url-select',
	templateUrl: './url-select.component.html',
  styleUrls: ['./url-select.component.scss']
})
export class URLSelectComponent implements OnInit, OnDestroy {
	@Input() options: string[]
	@Input() onUpdate: Function

	@ViewChild('body') body: ElementRef<HTMLUListElement>
	@ViewChild('parent') parent: ElementRef<HTMLDivElement>

	checkClose = (event: MouseEvent) => {
		const target = event.target as HTMLElement
		if (!this.parent.nativeElement.contains(target)) {
			this.parent.nativeElement.classList.remove('visible')
		}
	}

	ngOnInit(): void {
		document.addEventListener('click', this.checkClose)
	}

	ngOnDestroy(): void {
		document.removeEventListener('click', this.checkClose)
	}

	getSelected(event: Event): string[] {
		const element: Element = event.target as HTMLInputElement
		const list = element.closest('ul')
		const values: string[] = []
		list.querySelectorAll('input').forEach(input => {
			if (input.checked) {
				values.push(input.value)
			}
		})
		return values
	}

	onSelect(event: Event) {
		this.onUpdate(this.getSelected(event))
	}

	onContainerClick(event: Event) {
		const target: Element = event.target as HTMLDivElement
		const element = target.closest('div.dropdown-check-list')
		if (element.classList.contains('visible')) {
  	  element.classList.remove('visible');
		} else {
  	  element.classList.add('visible');
		}
	}
}
