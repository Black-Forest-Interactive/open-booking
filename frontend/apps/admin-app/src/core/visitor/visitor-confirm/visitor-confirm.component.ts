import {Component, computed, input, output, signal} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {VerificationStatus, Visitor} from "@open-booking/core";
import {VisitorService} from "@open-booking/admin";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-visitor-confirm',
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    MatProgressSpinner
  ],
  templateUrl: './visitor-confirm.component.html',
  styleUrl: './visitor-confirm.component.scss',
})
export class VisitorConfirmComponent {
  data = input.required<Visitor>()
  changed = output<boolean>()

  processing = signal(false)
  disabled = computed(() => this.data().verification.status === VerificationStatus.CONFIRMED || this.processing())

  constructor(private service: VisitorService) {
  }


  protected confirmMail() {
    if (this.processing()) return
    this.processing.set(true)
    this.service.confirm(this.data().id).subscribe({
      complete: () => {
        this.processing.set(false)
        this.changed.emit(true)
      }
    })
  }

}
