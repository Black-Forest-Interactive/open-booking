import {Component} from '@angular/core';
import packageJson from '../../../../../package.json';

@Component({
  selector: 'app-admin-footer',
  imports: [],
  templateUrl: './admin-footer.component.html',
  styleUrl: './admin-footer.component.scss',
})
export class AdminFooterComponent {
  version = packageJson.version
  currentYear = new Date().getFullYear()
}
