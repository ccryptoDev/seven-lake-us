import { SafeResourceUrl } from "@angular/platform-browser";

export type EmailTemplate = {
	id: string;
	tag: string;
	title: string;
	category: string;
	
	description: string;
	download: string
	order: string
	price: string

	Document_Link: string
	Document_Name: string | null
	documentUrl: string | SafeResourceUrl
	
	Thumbnail_Link: string
	Thumbnail_Name: string | null
	thumbnail: string | SafeResourceUrl

	createdAt: string;
	updatedAt: string;
}