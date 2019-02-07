import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { retry, catchError, tap } from 'rxjs/operators';
import { throwError, Observable, of, BehaviorSubject } from 'rxjs';
import { Query, User } from '../interfaces/interfaces';
import { NzNotificationService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // github API base URL
  baseUrl = 'https://api.github.com/';

  // caching last query result and page number so a reload wont be needed if user goes back
  currentPage = new BehaviorSubject<number>(null);
  queryResult = new BehaviorSubject<Query>({
    total_count: null,
    incomplete_results: false,
    items: []
  });

  constructor(private http: HttpClient, private notification: NzNotificationService) { }

  searchUsers(query: string, page: number): Observable<Query> {

    return this.http.get<Query>(`${this.baseUrl}search/users?q=${query}&per_page=30&page=${page}`)
      .pipe(
        tap(data => {
          // update last page and query result data
          this.queryResult.next(data);
          this.currentPage.next(page);
        }),
        // retry request if it fails the first time
        retry(2),
        catchError(this.handleError)
      );
  }

  getUser(user: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}users/${user}`)
      .pipe(
        retry(2),
        catchError(this.handleError)
      );
  }

  getUserRepos(user: string): Observable<any> {
    return this.http.get(`${this.baseUrl}users/${user}/repos?per_page=10`)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // notification service instance
  showNotification(message: string) {
    this.notification.create('error', 'Notification',
      message);
  }

  // handle request errors and show user an error message
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      this.showNotification('Please confirm that you are connected to the internet.');
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      this.showNotification('Sorry, we are currently having issues talking to github.');
    }
    this.showNotification('Something bad happened; please try again later.');
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
