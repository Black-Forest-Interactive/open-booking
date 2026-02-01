import {Component, effect} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {AdminToolbarComponent} from "./admin-toolbar/admin-toolbar.component";
import {AdminContentComponent} from "./admin-content/admin-content.component";
import {AdminFooterComponent} from "./admin-footer/admin-footer.component";
import {environment} from "../environments/environment";
import {AuthService} from "@open-booking/shared";
import LogRocket from 'logrocket';


@Component({
  imports: [RouterModule, MatCardModule, MatButtonModule, MatIconModule, AdminToolbarComponent, AdminContentComponent, AdminFooterComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'admin-app';

  constructor(private authService: AuthService) {
    if (environment.logrocket && environment.logrocketAppId.length > 0) {
      LogRocket.init(environment.logrocketAppId)
    }

    effect(() => {
      let p = this.authService.principal()
      if (p) LogRocket.identify(p.id)
    })
  }
}
