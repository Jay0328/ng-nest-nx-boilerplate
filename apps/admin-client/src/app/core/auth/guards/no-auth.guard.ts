import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<UrlTree | boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuth => (isAuth ? this.router.parseUrl('/login') : true))
    );
  }
}
