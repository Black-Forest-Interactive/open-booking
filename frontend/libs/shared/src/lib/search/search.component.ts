import {Component, input, output} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {TranslatePipe} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {debounceTime, distinctUntilChanged, Subject} from "rxjs";

@Component({
  selector: 'lib-search',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TranslatePipe
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {

  label = input('')
  icon = input('search')
  disabled = input(false)

  search = output<string>()

  private keyUp = new Subject<string>()

  constructor() {
    this.keyUp.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(data => this.search.emit(data))
  }

  handleKeyUp(value: string) {
    this.keyUp.next(value);
  }


}
