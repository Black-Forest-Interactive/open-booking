import {Component, input, output, signal} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {debounceTime} from "rxjs";
import {DailyOffersFilterRequest} from "@open-booking/admin";

@Component({
  selector: 'app-dashboard-filter',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard-filter.component.html',
  styleUrl: './dashboard-filter.component.scss',
})
export class DashboardFilterComponent {

  availableGuides = input<string[]>([])

  showFilters = signal(false)

  filterChange = output<DailyOffersFilterRequest>()

  filterForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      guide: [''],
      status: ['all'],
      showName: ['']
    })

    this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => {
        this.filterChange.emit(values)
      })
  }

  protected toggleFilters() {
    this.showFilters.update(value => !value)
  }

  protected hasActiveFilters(): boolean {
    const values = this.filterForm.value
    return values.guide !== '' || values.status !== 'all' || values.showName !== ''
  }

  protected clearAllFilters() {
    this.filterForm.reset({
      guide: '',
      status: 'all',
      showName: ''
    })
  }

  protected clearShowName() {
    this.filterForm.patchValue({showName: ''})
  }
}
