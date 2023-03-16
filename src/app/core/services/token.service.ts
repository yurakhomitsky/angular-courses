import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { BASE_PATH } from '../tokens/base-url.token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private token: string = ''

  constructor(@Inject(BASE_PATH) private basePath: string, private http: HttpClient) {}

  public getToken(): Observable<string> {
    if (this.token) {
      return of(this.token);
    }

    const url = `${this.basePath}/auth/anonymous?platform=subscriptions`

    return this.http.get<{ token: string }>(url).pipe(
      catchError(() => of({ token: '' })),
      tap(({ token }) => {
        this.token = token;
      }),
      map(({ token }) => token)
    );
  }
}
