import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive,AsyncPipe,NgIf],templateUrl:'./app.component.html'})
export class AppComponent {
 readonly auth=inject(AuthService); private router=inject(Router);
 salir():void { this.auth.logout();void this.router.navigate(['/login']); }
}
