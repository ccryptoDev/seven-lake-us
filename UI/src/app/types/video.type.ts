import { SafeUrl } from "@angular/platform-browser";

export type VideoType = {
	id: string
	title: string;
	category: string;
	createdAt: string;
	updatedAt: string;
	description: string;
	order: string;
	price: string;
	tags: string[];
	thumbnailName: string;
	thumbnailURL: string | SafeUrl;
	videoName: string;
	videoURL: string | SafeUrl;
}