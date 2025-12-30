import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {PortalContentComponent} from "./portal-content/portal-content.component";
import {PortalToolbarComponent} from "./portal-toolbar/portal-toolbar.component";
import {PortalFooterComponent} from "./portal-footer/portal-footer.component";

@Component({
  imports: [RouterModule, CommonModule, MatCardModule, MatButtonModule, MatIconModule, PortalContentComponent, PortalToolbarComponent, PortalFooterComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'portal-app';
}
