import {Component, computed, effect, output, resource, signal} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {TranslatePipe} from "@ngx-translate/core";
import {DatePipe} from "@angular/common";
import {toPromise} from "@open-booking/shared";
import {DashboardService} from "@open-booking/admin";
import {WeekSummary} from "@open-booking/core";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-week-select',
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    TranslatePipe,
    DatePipe
  ],
  templateUrl: './week-select.component.html',
  styleUrl: './week-select.component.scss',
})
export class WeekSelectComponent {

  selectedWeekChanged = output<WeekSummary>()

  private weekSummaryResource = resource({
    loader: param => toPromise(this.service.getWeeksSummary(), param.abortSignal)
  })

  weekSummary = computed(() => this.weekSummaryResource.value() ?? [])
  selectedWeek = signal<WeekSummary | undefined>(undefined)

  constructor(private service: DashboardService) {
    effect(() => {
      let week = this.weekSummary()[0]
      this.handleWeekSelection(week)
    })
  }

  protected handleWeekSelection(week: WeekSummary) {
    this.selectedWeek.set(week)
    this.selectedWeekChanged.emit(week)
  }
}
