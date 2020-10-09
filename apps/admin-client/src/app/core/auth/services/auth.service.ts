import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { AuthPayload } from '@nnb/isomorphic/auth/auth-payload.typings';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUser$$ = new BehaviorSubject<AuthPayload>({} as AuthPayload);
  private readonly isAuthenticated$$ = new ReplaySubject<boolean>(1);
  readonly currentUser$ = this.currentUser$$.asObservable().pipe(distinctUntilChanged());
  readonly isAuthenticated$ = this.isAuthenticated$$.asObservable();

  private setCurrentUser(user: AuthPayload | null) {
    if (user) {
      this.currentUser$$.next(user);
      this.isAuthenticated$$.next(true);
    } else {
      this.isAuthenticated$$.next(false);
    }
  }

  get currentUser(): AuthPayload {
    return this.currentUser$$.value;
  }

  login(tokens) {
    const { accessToken } = tokens;
    const user = jwtDecode(accessToken);

    this.setCurrentUser(user);
  }

  logout() {
    this.setCurrentUser(null);
  }
}
