import {Component} from '@angular/core';
import {AuthService} from "@open-booking/shared";
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDividerModule} from "@angular/material/divider";
import {ReservationContentComponent} from "./reservation-content/reservation-content.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {DateTime} from "luxon";
import {interval} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MainContentComponent} from "../../shared/main-content/main-content.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {ReservationFilterService} from "./reservation-filter.service";

@Component({
  selector: 'app-reservation',
  imports: [
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDividerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    TranslatePipe,
    ReservationContentComponent,
    FormsModule,
    ReactiveFormsModule,
    MainContentComponent,
    MatProgressSpinner,
    MatSlideToggle
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {

  range = new FormGroup({
    start: new FormControl<DateTime | null>(null, Validators.required),
    end: new FormControl<DateTime | null>(null, Validators.required),
  })


  constructor(protected readonly filter: ReservationFilterService, protected readonly authService: AuthService) {
    this.range.valueChanges.subscribe(d => this.handleSelectionChange())

    interval(5000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.filter.reload())
  }

  protected handleSearch(text: string) {
    this.filter.handleSearch(text)
  }

  protected handlePageChange(event: PageEvent) {
    this.filter.handlePageChange(event)
  }

  protected handleSelectionChange() {
    let start = this.range.get('start')?.value
    let end = this.range.get('end')?.value
    if (this.range.invalid) return
    if (start != null && end != null) {
      this.applyFilter()
    }
  }

  protected applyFilter() {
    let filter = this.range.value
    this.filter.handleDateSelectionChanged(filter.start, filter.end)
  }

  protected clearFilters() {
    this.filter.clearFilters()
  }

  protected reload() {
    this.filter.reload()
  }

}
