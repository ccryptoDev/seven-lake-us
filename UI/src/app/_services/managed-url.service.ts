import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from '../../environments/environment';
import { ManagedURL } from "../types/managedURL.type";

@Injectable({ providedIn: 'root' })
export class ManagedURLService {
	apiURL = ''

	constructor(private http: HttpClient) {
		this.apiURL = environment.APIUrl;
	}

	addUrl(data): Observable<ManagedURL> {
		const url = `${this.apiURL}/api/urls`
		return this.http.post<ManagedURL>(url, data);
	}

	listUrl(): Observable<ManagedURL[]> {
		const url = `${this.apiURL}/api/urls`
		return this.http.get<ManagedURL[]>(url);
	}

	findUrl(id: string): Observable<ManagedURL> {
		const url = `${this.apiURL}/api/urls/${id}`
		return this.http.get<ManagedURL>(url);
	}

	updateUrl(id: string, data): Observable<ManagedURL> {
		const url = `${this.apiURL}/api/urls/${id}`
		return this.http.put<ManagedURL>(url, data);
	}
	
	deleteUrl(id: string): Observable<any> {
		const url = `${this.apiURL}/api/urls/${id}`
		return this.http.delete(url);
	}
}