import { SafeUrl } from "@angular/platform-browser"

export type Document = {
	id: string
	Document_Name: string,
	Thumbnail_Name: string,
	title: string,
	category: string,
	download: string,
	price: string,
	order: string,
	tag: string,
	description: string,
	Document_Link: string,
	Thumbnail_Link: string,

	thumbnail: string | SafeUrl,
	documentUrl: string | SafeUrl,

	createdAt: string,
	updatedAt: string,
}