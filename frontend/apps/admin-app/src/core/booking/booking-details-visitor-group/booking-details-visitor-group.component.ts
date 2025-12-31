import {Component, input, output, signal} from '@angular/core';
import {BookingRequestInfo, VisitorChangeRequest} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {GenericRequestResult} from "@open-booking/shared";
import {RequestService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {VisitorChangeComponent} from "../../visitor/visitor-change/visitor-change.component";
import {VisitorInfoComponent} from "../../visitor/visitor-info/visitor-info.component";

@Component({
  selector: 'app-booking-details-visitor-group',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    VisitorChangeComponent,
    VisitorInfoComponent
  ],
  templateUrl: './booking-details-visitor-group.component.html',
  styleUrl: './booking-details-visitor-group.component.scss',
})
export class BookingDetailsVisitorComponent {
  data = input.required<BookingRequestInfo>()
  requestReload = output<boolean>()

  editMode = signal(false)
  changing = signal(false)


  constructor(
    private service: RequestService,
    private toast: HotToastService,
    private translation: TranslateService
  ) {
  }


  handleGroupChange(request: VisitorChangeRequest | undefined) {
    if (!request) {
      this.editMode.set(false)
      return
    }
    if (this.changing()) return
    this.changing.set(true)
    this.service.updateVisitor(this.data().id, request).subscribe(
      {
        next: (result) => this.handleResult(result)
      }
    )
  }

  private handleResult(result: GenericRequestResult) {
    let message = this.translation.instant(result.msg)
    if (result.success) {
      this.toast.success(message)
    } else {
      this.toast.error(message)
    }
    this.changing.set(false)
    this.editMode.set(false)
    this.requestReload.emit(true)
  }
}
