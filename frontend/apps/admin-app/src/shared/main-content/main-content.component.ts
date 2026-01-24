import {Component, input, output} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {SearchComponent} from "@open-booking/shared";

@Component({
  selector: 'app-main-content',
  imports: [MatToolbarModule, MatCardModule, SearchComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss',
})
export class MainContentComponent {
  // Inputs
  title = input<string>('')
  cardClass = input<string>('')
  containerClass = input<string>('')
  enableSearch = input<boolean>(false)
  searchLabel = input<string>('Search')

  // Outputs
  search = output<string>()

  handleSearch(query: string) {
    this.search.emit(query)
  }
}
