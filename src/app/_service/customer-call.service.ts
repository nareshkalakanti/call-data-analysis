import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CustomerCallService {
    constructor(private http: HttpClient) { }
    getCustomerData():Observable<any>{
        return this.http.get('/assets/db.json');
    }
}