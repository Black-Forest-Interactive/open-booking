import {Component, computed, input, model, signal} from '@angular/core';
import {Visitor} from "@open-booking/core";
import {GroupService} from "@open-booking/admin";
import {MatDialog} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {GroupStatusComponent} from "../../group/group-status/group-status.component";
import {GroupInfoDialogComponent} from "../../group/group-info-dialog/group-info-dialog.component";

@Component({
  selector: 'app-request-visitor-group-entry',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    GroupStatusComponent
  ],
  templateUrl: './request-visitor-group-entry.component.html',
  styleUrl: './request-visitor-group-entry.component.scss',
})
export class RequestVisitorEntryComponent {

  data = model.required<Visitor>()
  showDetails = input(true)

  confirming = signal(false)

  title = computed(() => this.data().title)
  contact = computed(() => this.data().contact)
  status = computed(() => this.data().status)

  constructor(private service: GroupService, private dialog: MatDialog) {
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
    this.dialog.open(GroupInfoDialogComponent, {data: this.data()});
  }
}
