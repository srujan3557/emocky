import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable()
export class UserService {
    apiURL = 'http://localhost:3000';
    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
    constructor(private httpClient: HttpClient) { }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead
          // TODO: better job of transforming error for user consumption
          console.log(`${operation} failed: ${error.message}`);
          // Let the app keep running by returning an empty result.
          return of(error as T);
        };
      }

    public getUserProfile() {
        return this.httpClient.get<any>(`${this.apiURL}/loyaltymembers`);
    }

    public createUserProfile(userData: any, isAdd: boolean): Observable<any> {
      if (isAdd) {
        return this.httpClient.post<any>(`${this.apiURL}/loyaltymembers`, JSON.stringify(userData), this.httpOptions).pipe(
          map((product) => console.log(`added product w/ id=${product.id}`)),
          catchError(this.handleError<any>('addUserData'))
        );
      } else {
        return this.httpClient.put<any>(`${this.apiURL}/loyaltymembers/${userData.loyaltyMemberId}`, JSON.stringify(userData), this.httpOptions).pipe(
          map((product) => console.log(`added product w/ id=${product.id}`)),
          catchError(this.handleError<any>('addUserData'))
        );
      }
    }

    public getLoyaltyMembers() {
        return this.httpClient.get<any>(`${this.apiURL}/loyaltymembers?filter[offset]=0&filter[limit]=100&filter[skip]=0`);
    }

    public getLoyaltyMember(loyaltyMemberId: string) {
        return this.httpClient.get<any>(`http://localhost:3000/loyaltymembers/${loyaltyMemberId}`);
    }

    public updateLoyaltyMember(loyaltyMember: any) {
        return this.httpClient.patch<any>(`http://localhost:3000/loyaltymembers/${loyaltyMember.loyaltyMemberId}`, loyaltyMember);
    }
}
