import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient, private _router: Router) { }

  register(user) {
    return this._http.post('http://localhost:4000/register', user);
  }
  login(email: String, password: String) {
    console.log(email + " " + password);
    return this._http.post('http://localhost:4000/login', { email, password })
      .pipe(tap(res => {
        this.setSession(res);
        this.startRefreshTokenTimer();
      }));
  }
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('access_token_expiration');
    const refreshToken = localStorage.getItem('refresh_token')
    const logoutBody = { token: refreshToken };
    return this._http.request('delete', 'http://localhost:4000/logout', { body: logoutBody }).pipe(tap((res => {
      this.stopRefreshTokenTimer()
      localStorage.removeItem('refresh_token');
      this._router.navigate(['/login']);
    })));
  }
  setSession(authResult) {
    const expiresAt = moment(authResult.expiresAt * 1000);
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('access_token_expiration', JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('refresh_token', authResult.refreshToken);
  }
  private getExpiration() {
    const token_expiration = localStorage.getItem('access_token_expiration');
    return moment(JSON.parse(token_expiration));
  }
  refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    return this._http.post('http://localhost:4000/token', { token: refreshToken })
      .pipe(tap(res => {
        localStorage.setItem('access_token', res['accessToken']);
        const expiresAt = moment(res['expiresAt'] * 1000);
        localStorage.setItem('access_token_expiration', JSON.stringify(expiresAt.valueOf()));
        this.startRefreshTokenTimer();
      }));
  }
  private refreshTokenTimeout;
  private startRefreshTokenTimer() {
    const expires = this.getExpiration();
    const now = moment();
    const timeout = moment.duration(expires.valueOf()).subtract(moment.duration(now.valueOf())).subtract(moment.duration(10, 'minutes'));
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout.asMilliseconds());
  }
  private stopRefreshTokenTimer(){
    clearTimeout(this.refreshTokenTimeout);
  }
  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }
  isLoggedOut() {
    return !this.isLoggedIn();
  }
}
