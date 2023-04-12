import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { User } from '../_models';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Document } from '../types/document.type';
import { UserDetails } from '../types/user-details.type';




@Injectable({ providedIn: 'root' })
export class UserService {
    Api_url = 'http://localhost:17001';
    public  MainsearchTag = new BehaviorSubject<any>('');
    public DocumentServiceTag = new BehaviorSubject<any>('');
    // MainsearchTag = this.behaviorsubject.asObservable();
    mainSearchBarGettingVideo;
    mainSearchBarGittingDocument;
    leadsData: any;
    editdocumentId;
    formManagerId ;
    documentId ;
    docmentadmin;
    token = '';
    userDetails: any;
    email: string;
    redirectLocalVal: any = {};
    agentDetails;
    inviteAgentData = '';
    constructor(private http: HttpClient, private toastr: ToastrService) {
        this.Api_url = environment.APIUrl;
    }
    // setUser(user):void {
    //     this.behaviorsubject.next(user);
    //   }
    PostMainSearch(data): Observable<any>{
        return this.http.get(`${this.Api_url}/api/MainSearchBar?DocumentandVideo=${data}`);
    }

    setEmail(email: string) {
        this.email = email;
    }

    getAll(): Observable<any> {
        return this.http.get<User[]>(`/users`);
    }

    getAllUsers(url): Observable<any> {
        return this.http.get(this.Api_url + url);
    }

    getById(id: number): Observable<any> {
        return this.http.get(`/users/` + id);
    }

    registerMail(params): Observable<any> {
        return this.http.post(`${this.Api_url}/api/auth/registerMail`, params);
    }
    registerMailToOwner(params): Observable<any> {
        return this.http.post(`${this.Api_url}/api/auth/registerMailToOwner`, params);
    }
    leadNotes(params): Observable<any> {
        return this.http.post(`${this.Api_url}/api/auth/leadNotes`, params);
    }

    postReqestSaveUser(param, url): Observable<any> {
        return this.http.post<any>(this.Api_url + url, param);
    }
    postReqestSaveUser1(param, url) {
        return this.http.post<any>(this.Api_url + url, param);
    }
    editLeadssendEmail(data){
        return this.http.post( `${this.Api_url}/api/editLeads`, data);
    }
    getRequestAllUserData(url) {
        // alert(this.Api_url + url );
        return this.http.get(this
            .Api_url + url);
    }
    SendColorDetails(obj){
        return this.http.post(`${this.Api_url}/api/settingcolorcode`, obj);
    }

    // simplified version of password reset - sends new
    // password to user via email, made as part of migration
    // process to sync users, that are in CRM, but not in the DB
    sendPassword(userEmail: string) {
        return this.http.post(`${this.Api_url}/api/auth/password/send`, { email: userEmail });
    }

    resetPassword(params) {
        return this.http.patch(`${this.Api_url}/api/auth/resetPassword`, params);
    }
    inviteAgent(invite) {
        return this.http.post(`${this.Api_url}/api/auth/inviteAgent`, invite);
    }

    leadMail(params) {
        return this.http.post(`${this.Api_url}/api/auth/leadsMail`, params);
    }
    
    getRequestForgotPassword(url, param) {
        return this.http.post(`${this.Api_url}/api/auth/email/forgotPassword`, { email: param });
    }

    getZohoToken(): Observable<any> {
        return this.http.post(`${this.Api_url}/api/leads/zohoToken`, null);
    }

    getMemberId(code): Observable<any> {
        return this.http.get(`${this.Api_url}/api/user/membernumber?code=${code}`);
    }

    getAgentsByEmail(email: string = this.email, code = this.token): Observable<any> {
        return this.http.get(`${this.Api_url}/api/user/getAgentByEmail`, { params: { email, code } });
    }

    update(user: User) {
        return this.http.put(`/users/` + user.id, user);
    }
    updateColorCode(AccountOffice, data){
        return this.http.put(`${this.Api_url}/api/updateColorCode?AccountType=${AccountOffice}`, data);
    }
    delete(id: number) {
        return this.http.delete(`/users/` + id);
    }
    getRequestGetUserById(url, id): Observable<any> {
        // alert(this.Api_url + url + `?id=${id}`)
        return this.http.get(this.Api_url + url + `?id=${id}`);
    }
    getRequestGetUserByParentId(url, id) {
        // alert(this.Api_url + url + `?id=${id}`)
        return this.http.get(this.Api_url + url + `?parentId=${id}`);
    }
    putReqestUserUpdate(param, url, userId) {
        // console.log('this is params'+ param+ 'this is url'+url+'id'+ userId)
        return this.http.put(this.Api_url + url + `?id=${userId}`, param);
    }
    
    addLead(body, token = this.token): Observable<any> {
        const url = `${this.Api_url}/api/leads/`;
        return this.http.post<any>(url, body, { params: { code: token } });
    }

    listLeads(member: string, token = this.token): Observable<any> {
        const url = `${this.Api_url}/api/leads/`;
        return this.http.get<any>(url, { params: { code: token, member } })
    }
    
    getRequestGetCompanyById(url, id) {

        // alert(this.Api_url + url + `?id=${id}`)
        return this.http.get(this.Api_url + `/api/Companies/${id}`);
    }

  uploadimage(id, leadFile): Observable<any>{
    const url = `${environment.APIUrl}/api/leads/zohoLeadsFile?code=${this.token}&leadId=${id}`;
    return this.http.post(url, leadFile);
  }
  uploadData(id, data): Observable<any>{
    const url = `${environment.APIUrl}/api/leads/zohoAgent?code=${this.token}&AgentId=${id}`;
    return this.http.post(url, data);
  }
  uploadDocument(leadFile): Observable<any>{
    const url = `${environment.APIUrl}/api/user/uploaddocuments`;
    return this.http.post(url, leadFile);
  }
  
    showSuccess(msg) {
        this.toastr.success(msg);
    }
    showError(error) {
        this.toastr.error(error);
    }
    getRequestEmailExists(param, url) {
        return this.http.get(this.Api_url + url + `?email=${param}`);
    }
    compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }
    getAgentData(code): Observable<any> {
        return this.http.get(`${this.Api_url}/api/leads/zohoAgents?code=${code}`);
    }

    updateAgentData(id, data): Observable<any>{
      return  this.http.put(`${this.Api_url}/api/user/updateAgents?code=${this.token}&id=${id}`, data);
    }

    getallAgents(): Observable<any>{
    return this.http.get(`${this.Api_url}/api/leads/inviteagents?code=${this.token}&member=${this.userDetails.Member_Number}`);
    }

    getLeadInfo(): Observable<any>{
        return this.http.get(`${this.Api_url}/api/leads/leadsByAgent?code=${this.token}&member=${this.userDetails.Member_Number}`);
    }
    AllZohoAgents(): Observable<any>{
        return this.http.get(`${this.Api_url}/api/leads/zohoAgents?code=${this.token}`);
    }
    getOfficeNameFromApi(): Observable<any>{
        return this.http.get(`${this.Api_url}/api/leads/gettingallOffice?code=${this.token}`);
    }
    AllZohoLeads(): Observable<any>{
        return this.http.get(`${this.Api_url}/api/leads/zohoLeads?code=${this.token}`);
    }

    updateSignUp(id, data): Observable<any>{
        return this.http.put(`${this.Api_url}/api/auth/updatesinup/${id}`, data);
    }

    selectPage(userEmail: string, pageId: string): Observable<any> {
        return this.http.post(`${this.Api_url}/api/landing/page/select`, {email: userEmail, pageId});
    }

    listInactiveUsers(): Observable<UserDetails[]>{
        return this.http.get <UserDetails[]>(`${this.Api_url}/api/auth/users/inactive`);
    }

    gettingColorCode(): Observable<any> {
        return this.http.get(`${this.Api_url}/api/gettingcolorCode`);
    }

    getSourceName(sourceLink) {
        const orgLink = sourceLink; // 'https://www.vice.com/en_us/article/889974/navy-releases-new-ufo-incident-reports';
        // this.childData.articleOrgLink = orgLink;
        let originalSourceLink = orgLink;
        if (orgLink.indexOf('https') >= 0) {
            originalSourceLink = orgLink.slice(8, orgLink.length);
        } else if (orgLink.indexOf('http') >= 0) {
            originalSourceLink = orgLink.slice(7, orgLink.length);
        }
        let sourceName = originalSourceLink;
        // alert(sourceName)
        // if (originalSourceLink.indexOf("/") >= 0) {
        //     sourceName = originalSourceLink.slice(0,originalSourceLink.indexOf("/"));
        // }
        // console.log(sourceName);

        if (sourceName.indexOf('www') >= 0) {
            sourceName = sourceName
                ? sourceName.slice(4, sourceName.length)
                : sourceName;
        }

        return sourceName;
    }

    // Profile update url start

    profileUpdate(data): Observable<any> {
        return this.http.put(`${this.Api_url}/api/user/updateAgents`, data, {
            params: {
                id: this.userDetails.id,
                member: encodeURI(this.userDetails.Member_Number),
            }
        });
    }

    updateNote(body): Observable<any> {
        return this.http.put(`${this.Api_url}/api/leads/note`, body);
    }

    updateWebsite(Website: string, agentId = this.userDetails.id): Observable<any> {
        const body = { Website }
        return this.http.put(`${this.Api_url}/api/user/website`, body, { params: { id: agentId } });
    }

    messageAgent(body): Observable<any> {
        return this.http.post(`${this.Api_url}/api/leads/message`, body);
    }

    getInviteAgentsData(): Observable<any> {
        const params = {
            member: this.userDetails.Member_Number,
            userId: this.userDetails.id
        }

        return this.http.get(`${this.Api_url}/api/leads/teamagents`, { params });
    }

    getDocumentData(): Observable<any>{
        return this.http.get(`${environment.APIUrl}/api/user/getdocuments`);
    }

    // Refactored version of getDocumentData
    listDocuments(category=''): Observable<Document[]> {
        const url = `${this.Api_url}/api/user/documents`
        return this.http.get<Document[]>(url, {params: {category}});
    }

    addOffice(res): Observable<any>{
        return this.http.post(`${this.Api_url}/api/user/addOffice`, res);
    }
    getSingleOffice(id): Observable<any>{
        return this.http.get(`${this, this.Api_url}/api/user/getoffice/` + id);
    }
    addForm(res): Observable<any>{
        return this.http.post(`${this.Api_url}/api/formManager/addformManager`, res);
    }
    getAgentFormData(): Observable<any>{
        return this.http.get(`${this.Api_url}/api/formManager/getformManager`);
    }
    DeleteSingleFormManagerData(id): Observable<any>{
        return this.http.delete(`${this.Api_url}/api/formManager/deleteformManager/${id}`);
    }
    getvideos(): Observable<any>{
        return this.http.get(`${environment.APIUrl}/api/user/getVideos`);
    }
    
    getVideosV2(): Observable<any> {
        return this.http.get(`${environment.APIUrl}/api/user/sales/videos`);
    }

    uploadVideos(videosFile): Observable<any>{
        const url = `${environment.APIUrl}/api/user/sales/videos`;
        return this.http.post(url, videosFile);
    }

    getOfficeData(): Observable<any>{
        return this.http.get(`${environment.APIUrl}/api/user/getoffice`);
    }
    UpdateOfficceData(id, data): Observable<any>{
        return this.http.put(`${environment.APIUrl}/api/user/updateOffice/${id}`, data);
    }
    UpdateFormAgentData(id, data): Observable<any>{
        return this.http.put(`${this.Api_url}/api/formManager/addformManager/${id}`, data);
    }

    getSingleFormAgent(id): Observable<any>{
        return this.http.get(`${this.Api_url}/api/formManager/getformManager/${id}`);
    }

    getSingleDocument(id): Observable<any>{
        return this.http.get(`${this.Api_url}/api/user/getdocuments/${id}`);
    }
    UpdateDocument(id, data): Observable<any>{
        return this.http.put(`${this.Api_url}/api/user/updateDocument/${id}`, data);
    }
    DeleteSingleDocument(id): Observable<any>{
        return this.http.delete(`${this.Api_url}/api/user/deletedocument/${id}`);
    }
    getFiles(fileName): Observable<any> {
        return this.http.get(`${environment.APIUrl}/api/user/getfiles/${fileName}`, { responseType: 'blob' as 'json' });
    }
    updateDownloaddocument(id, value): Observable<any>{
        return this.http.put(`${this.Api_url}/api/user/updatedownload/${id}`, value);
    }

    // profile update ulr end

    getAgentsByMemberCode(memberId: string, code = this.token): Observable<any> {
        return this.http.get(`${this.Api_url}/api/getPerticularLandigPage?` + new URLSearchParams({code, memberId}));
    }
    updateleadsData(id, data): Observable<any> {
        return this.http.put(`${this.Api_url}/api/user/updateleadDetails?code=${this.token}&id=${id}`, data);
    }
    gettingZohoAgent(sponser): Observable<any>{
        return this.http.get(`${this.Api_url}/api/leads/leadsByMemberNumber?code=${this.token}&Member_Number=${sponser}`);
    }
    // gettingZohoAgent(sponser):Observable<any>{
    //     // return this.http.get(`${this.Api_url}/api/leads/leadsByMemberNumber?code=${this.token}&Member_Number=${}`);
    // }
}
