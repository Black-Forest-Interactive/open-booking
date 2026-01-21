import {Component, effect, inject, model, resource, signal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map, of} from "rxjs";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NotificationTemplate, NotificationTemplateChangeRequest, NotificationTemplateType} from "@open-booking/core";
import {NotificationService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {navigateToNotification} from "../../../app/app.navigation";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {QuillModule} from "ngx-quill";

@Component({
  selector: 'app-notification-change',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    QuillModule,
    ReactiveFormsModule,
    TranslatePipe,
    LoadingBarComponent,

  ],
  templateUrl: './notification-change.component.html',
  styleUrl: './notification-change.component.scss',
})
export class NotificationChangeComponent {
  private route = inject(ActivatedRoute)
  id = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))

  private notificationResource = resource({
    params: this.id,
    loader: param => (param.params) ? toPromise(this.service.getNotificationTemplate(param.params), param.abortSignal) : toPromise(of())
  })


  data = model<NotificationTemplate | null>(null)
  title = signal('NOTIFICATION.CHANGE.Create')
  reloading = signal(false)
  types: string[] = [NotificationTemplateType.BOOKING_CREATED_ADMIN, NotificationTemplateType.BOOKING_CREATED_CONTACT, NotificationTemplateType.BOOKING_CHANGED_ADMIN, NotificationTemplateType.BOOKING_CHANGED_CONTACT]
  languages: readonly string[]

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private service: NotificationService,
    private toast: HotToastService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.languages = this.translate.getLangs()
    this.form = this.fb.group({
        lang: [this.translate.getCurrentLang(), Validators.required],
        type: [this.types[0], Validators.required],
        subject: ['', Validators.required],
        content: ['', Validators.required]
      }
    )
    effect(() => {
      const offer = this.notificationResource.value()
      if (offer) this.handleDataEdit(offer)
    })
  }


  private handleDataEdit(data: NotificationTemplate) {
    this.data.set(data)
    this.initValues(data)
    this.translate.get("NOTIFICATION.CHANGE.Update", {offer: data.id}).subscribe(text => this.title = text)
    this.validateForm()
  }

  private initValues(data: NotificationTemplate) {
    this.form.get('lang')?.setValue(data.lang)
    this.form.get('type')?.setValue(data.type)
    this.form.get('subject')?.setValue(data.subject)
    this.form.get('content')?.setValue(data.content)
  }

  private validateForm() {
    this.form.markAllAsTouched()
  }


  onSubmit() {
    if (this.form.invalid) {
      this.validateForm()
      this.showFormInvalidError()
      return
    }

    this.reloading.set(true)
    let data = this.data()
    if (data) {
      this.update(data)
    } else {
      this.create()
    }
  }

  private showFormInvalidError() {
    this.translate.get("NOTIFICATION.Message.FormInvalid").subscribe(
      msg => this.toast.error(msg)
    )
  }

  private get request(): NotificationTemplateChangeRequest | null {
    return this.form.value
  }

  private create() {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.createNotificationTemplate(request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private update(notification: NotificationTemplate) {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.updateNotificationTemplate(notification.id, request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private handleChangeResult(result: NotificationTemplate) {
    if (result == null) {
      this.translate.get("NOTIFICATION.Message.CreateFailure").subscribe(
        msg => this.toast.error(msg)
      )
    } else {
      this.translate.get("NOTIFICATION.Message.CreateSuccess").subscribe(
        msg => {
          this.toast.success(msg)
          navigateToNotification(this.router)
        }
      )
    }
  }

  cancel() {
    navigateToNotification(this.router)
  }
}
