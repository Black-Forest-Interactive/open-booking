import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-forbidden',
  imports: [MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss',
})
export class ForbiddenComponent {
  constructor(private router: Router) {
  }

  goBack(): void {
    window.history.back()
  }

  goHome(): void {
    this.router.navigate(['/'])
  }
}
