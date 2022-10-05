import { Pipe, PipeTransform } from '@angular/core';
import { Document } from 'src/app/types/document.type';

@Pipe({
	name: 'sortDocument'
})
export class SortDocumentsPipe implements PipeTransform {

	sortDocuments(list: Document[]) {
		return list.sort((a, b) => {
			const dateA = new Date(a.createdAt)
			const dateB = new Date(b.createdAt)

			return dateA <= dateB ? 1 : -1
		})
	}

	sortByKey(list: Document[], key: string) {
		return list.sort((a, b) => {
			return a[key].toLowerCase() >= b[key].toLowerCase() ? 1 : -1
		})
	}

	transform(list: Document[], category: string): any {
		switch (category) {
			case 'Date Upload':
				list = this.sortDocuments(list)
				break
			case 'Name':
				list = this.sortByKey(list, 'title')
				break
			case 'Category':
				list = this.sortByKey(list, 'category')
				break
			default:
				break
		}
		return list
	}
}

