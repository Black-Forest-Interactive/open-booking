import {Component, computed, inject, resource} from '@angular/core';
import {ResponseService} from "@open-booking/admin";
import {toPromise} from "@open-booking/shared";
import {map} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {ActivatedRoute, Router} from "@angular/router";
import {navigateToResponse} from "../../../app/app.navigation";

@Component({
  selector: 'app-response-details',
  imports: [],
  templateUrl: './response-details.component.html',
  styleUrl: './response-details.component.scss',
})
export class ResponseDetailsComponent {
  private route = inject(ActivatedRoute)
  responseId = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))

  private responseResource = resource({
    params: this.responseId,
    loader: param => toPromise(this.service.getResponse(param.params), param.abortSignal)
  })

  reloading = computed(() => this.responseResource.isLoading())
  data = computed(() => this.responseResource.value())

  constructor(
    private service: ResponseService,
    private router: Router
  ) {
  }

  back() {
    navigateToResponse(this.router)
  }

  reload() {
    this.responseResource.reload()
  }
}
