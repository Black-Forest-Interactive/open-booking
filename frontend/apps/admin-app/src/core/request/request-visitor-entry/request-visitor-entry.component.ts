import {Component, computed, input, model, signal} from '@angular/core';
import {Visitor} from "@open-booking/core";
import {VisitorService} from "@open-booking/admin";
import {MatDialog} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {VisitorInfoDialogComponent} from "../../visitor/visitor-info-dialog/visitor-info-dialog.component";

@Component({
  selector: 'app-request-visitor-entry',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './request-visitor-entry.component.html',
  styleUrl: './request-visitor-entry.component.scss',
})
export class RequestVisitorEntryComponent {

  data = model.required<Visitor>()
  showDetails = input(true)

  confirming = signal(false)

  title = computed(() => this.data().title)
  name = computed(() => this.data().name)
  status = computed(() => this.data().verification.status)

  constructor(private service: VisitorService, private dialog: MatDialog) {
  }

  confirm() {
    if (this.confirming()) return

    this.confirming.set(true)
    this.service.confirm(this.data().id).subscribe(
      {
        next: d => this.handleVisitorChange(d),
        complete: () => this.confirming.set(false)
      }
    )
  }

  private handleVisitorChange(d: Visitor) {
    this.data.set(d)
  }

  showDetailsDialog() {
    this.dialog.open(VisitorInfoDialogComponent, {data: this.data()});
  }
}
