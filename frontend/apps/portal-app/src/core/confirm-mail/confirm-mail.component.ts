import {Component, computed, inject, resource} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {GenericRequestResult, toPromise} from "@open-booking/shared";
import {BookingService} from "@open-booking/portal";
import {AppService} from "../../app/app.service";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-confirm-mail',
  imports: [
    TranslatePipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './confirm-mail.component.html',
  styleUrl: './confirm-mail.component.scss',
})
export class ConfirmMailComponent {
  private route = inject(ActivatedRoute)
  private key = toSignal(this.route.paramMap.pipe(map(params => params.get('key'))))

  private confirmMailResource = resource({
    params: this.key,
    loader: (param) => {
      return toPromise(this.service.confirmEmail(param.params ?? ''), param.abortSignal)
    }
  })

  result = computed(() => this.confirmMailResource.value())
  status = computed(() => this.getStatus(this.result()))
  reloading = this.confirmMailResource.isLoading

  constructor(private service: BookingService, protected app: AppService) {

  }

  private getStatus(r: GenericRequestResult | undefined) {
    if (!r) return 'unknown'
    return (r.success) ? 'confirmed' : 'failed';
  }
}
