import {Component, computed, inject, resource} from '@angular/core';
import {NotificationService} from "@open-booking/admin";
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {toPromise} from "@open-booking/shared";
import {navigateToNotification} from "../../../app/app.navigation";

@Component({
  selector: 'app-notification-details',
  imports: [],
  templateUrl: './notification-details.component.html',
  styleUrl: './notification-details.component.scss',
})
export class NotificationDetailsComponent {
  private route = inject(ActivatedRoute)
  notificationId = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))

  private notificationResource = resource({
    params: this.notificationId,
    loader: param => toPromise(this.service.getNotificationTemplate(param.params), param.abortSignal)
  })

  reloading = computed(() => this.notificationResource.isLoading())
  data = computed(() => this.notificationResource.value())

  constructor(
    private service: NotificationService,
    private router: Router
  ) {
  }

  back() {
    navigateToNotification(this.router)
  }

  reload() {
    this.notificationResource.reload()
  }
}
