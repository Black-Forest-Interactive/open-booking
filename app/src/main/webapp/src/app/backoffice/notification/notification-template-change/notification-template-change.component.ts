import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Location} from "@angular/common";
import {HotToastService} from "@ngneat/hot-toast";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {
  NOTIFICATION_TEMPLATE_TYPES,
  NotificationTemplate,
  NotificationTemplateChangeRequest
} from "../model/notification-template-api";
import {NotificationTemplateService} from "../model/notification-template.service";

@Component({
  selector: 'app-notification-template-change',
  templateUrl: './notification-template-change.component.html',
  styleUrls: ['./notification-template-change.component.scss']
})
export class NotificationTemplateChangeComponent {

  title: string = "NOTIFICATION.CHANGE.Create";
  reloading: boolean = false

  data: NotificationTemplate | null = null
  languages: string[] = []

  types: string[] = NOTIFICATION_TEMPLATE_TYPES
  form: FormGroup = this.fb.group({
      lang: [this.translate.currentLang, Validators.required],
      type: [this.types[0], Validators.required],
      subject: ['', Validators.required],
      content: ['', Validators.required]
    }
  )


  constructor(
    private fb: FormBuilder,
    private location: Location,
    private service: NotificationTemplateService,
    private toastService: HotToastService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.languages = this.translate.langs
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(+id, (e) => this.handleDataEdit(e))
    } else {
      this.handleDataCreate()
    }
  }


  private loadData(responseId: number, callback: (e: NotificationTemplate) => void) {
    this.reloading = true;
    this.service.getNotificationTemplate(responseId).subscribe(data => callback(data));
  }

  private handleDataCreate() {
    this.data = null;
    this.translate.get("NOTIFICATION.CHANGE.Create").subscribe(text => this.title = text);
  }

  private handleDataEdit(data: NotificationTemplate) {
    this.data = data;
    this.initValues(data);
    this.translate.get("NOTIFICATION.CHANGE.Update", {offer: data.id}).subscribe(text => this.title = text);
    this.validateForm();
    this.reloading = false;
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

    this.reloading = true;
    if (this.data == null) {
      this.create()
    } else {
      this.update(this.data)
    }
  }

  cancel() {
    this.location.back()
  }

  private get request(): NotificationTemplateChangeRequest | null {
    return this.form.value
  }

  private create() {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.createNotificationTemplate(request).subscribe((result) => this.handleCreateResult(result))
    }
  }

  private showFormInvalidError() {
    this.translate.get("NOTIFICATION.Message.FormInvalid").subscribe(
      msg => this.toastService.error(msg)
    )
  }

  private update(offer: NotificationTemplate) {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.updateNotificationTemplate(offer.id, request).subscribe((result) => this.handleCreateResult(result))
    }
  }

  private handleCreateResult(result: NotificationTemplate) {
    if (result == null) {
      this.translate.get("NOTIFICATION.Message.CreateFailure").subscribe(
        msg => this.toastService.error(msg)
      )
    } else {
      this.translate.get("NOTIFICATION.Message.CreateSuccess").subscribe(
        msg => {
          this.toastService.success(msg)
          this.router.navigate(["/backoffice/notification"]).then()
        }
      )
    }
  }
}
