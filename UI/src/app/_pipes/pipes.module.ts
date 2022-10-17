import { NgModule } from "@angular/core";
import { FilterLandingDatePipe } from "./filter/filter-landing.pipe";
import { DocumentFilterPipe } from "./search-document.pipe";
import { SearchFilterPipe } from "./search-filter.pipe";
import { SortAgentsPipe, SortZohoAgentsPipe } from "./sort/sort-agents.pipe";
import { SortDocumentsPipe } from "./sort/sort-documents.pipe";
import { SortLandingsPipe } from "./sort/sort-landings.pipe";
import { SortLeadsPipe } from "./sort/sort-leads.pipe";

@NgModule({
	declarations: [
		SearchFilterPipe, SortLandingsPipe,
		SortDocumentsPipe, DocumentFilterPipe,
		FilterLandingDatePipe, SortAgentsPipe,
		SortZohoAgentsPipe, SortLeadsPipe
	],
	exports: [
		SearchFilterPipe, SortLandingsPipe,
		SortDocumentsPipe, DocumentFilterPipe,
		FilterLandingDatePipe, SortAgentsPipe,
		SortZohoAgentsPipe, SortLeadsPipe,
	]
})
export class PipesModule { }