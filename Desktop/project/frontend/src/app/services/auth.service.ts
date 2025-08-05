import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any = null;
  private tokenKey = 'jwt_token';
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // Authentification
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        this.saveToken(res.token);
        this.user = res.user;
      })
    );
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem(this.tokenKey);
  }

  // Token
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Authentification & utilisateur
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUser(): any {
    return this.user;
  }

  setUser(user: any): void {
    this.user = user;
  }

  loadUser(): Observable<any> {
  const token = this.getToken();
  if (!token) return of({ user: null });

  return this.http.get<any>(`${this.apiUrl}/user`).pipe(
    tap(res => this.user = res.user),
    catchError(() => {
      this.user = null;
      return of({ user: null });
    })
  );
}

}
