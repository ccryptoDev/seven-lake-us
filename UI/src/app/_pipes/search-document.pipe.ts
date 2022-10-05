import { Pipe, PipeTransform } from '@angular/core';
import { Document } from '../types/document.type';

@Pipe({
	name: 'searchDocumentFilter'
})
export class DocumentFilterPipe implements PipeTransform {

	transform(list: Document[], filterText: string): any {
		return list ? list.filter(item => {
			if (item.tag.search(new RegExp(filterText, 'i')) > -1)
				return true
			return false
		}) : [];
	}
}

