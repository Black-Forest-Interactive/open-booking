import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {AdminToolbarComponent} from "../core/admin-toolbar/admin-toolbar.component";
import {AdminContentComponent} from "../core/admin-content/admin-content.component";
import {AdminFooterComponent} from "../core/admin-footer/admin-footer.component";


@Component({
  imports: [RouterModule, CommonModule, MatCardModule, MatButtonModule, MatIconModule, AdminToolbarComponent, AdminContentComponent, AdminFooterComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'admin-app';
}
