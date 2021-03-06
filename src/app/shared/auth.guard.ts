import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AccountApi } from './sdk/services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private accountApi: AccountApi
  ) { }

  canActivate() {
    if (this.accountApi.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
