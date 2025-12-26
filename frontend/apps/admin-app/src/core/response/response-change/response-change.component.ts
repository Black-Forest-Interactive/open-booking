import {Component, effect, inject, model, resource, signal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ResponseService} from "@open-booking/admin";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {Response, RESPONSE_TYPES, ResponseChangeRequest} from "@open-booking/core";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {QuillModule} from "ngx-quill";
import {navigateToResponse} from "../../../app/app.navigation";
import {HotToastService} from "@ngxpert/hot-toast";

@Component({
  selector: 'app-response-change',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    LoadingBarComponent,
    QuillModule,
    TranslatePipe
  ],
  templateUrl: './response-change.component.html',
  styleUrl: './response-change.component.scss',
})
export class ResponseChangeComponent {
  private route = inject(ActivatedRoute)
  id = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))

  private responseResource = resource({
    params: this.id,
    loader: param => toPromise(this.service.getResponse(param.params), param.abortSignal)
  })

  data = model<Response | null>(null)
  title = signal('RESPONSE.CHANGE.Create')
  reloading = signal(false)
  types: string[] = RESPONSE_TYPES
  languages: readonly string[] = []

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private service: ResponseService,
    private toast: HotToastService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.languages = this.translate.getLangs()
    this.form = this.fb.group({
        lang: [this.translate.getCurrentLang(), Validators.required],
        type: [this.types[0], Validators.required],
        title: ['', Validators.required],
        content: ['', Validators.required]
      }
    )
    effect(() => {
      const value = this.responseResource.value()
      if (value) this.handleDataEdit(value)
    })
  }


  private handleDataEdit(data: Response) {
    this.data.set(data)
    this.initValues(data)
    this.translate.get("RESPONSE.CHANGE.Update", {offer: data.id}).subscribe(text => this.title = text)
    this.validateForm()
  }

  private initValues(data: Response) {
    this.form.get('lang')?.setValue(data.lang)
    this.form.get('type')?.setValue(data.type)
    this.form.get('title')?.setValue(data.title)
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
    this.translate.get("RESPONSE.Message.FormInvalid").subscribe(
      msg => this.toast.error(msg)
    )
  }

  private get request(): ResponseChangeRequest | null {
    return this.form.value
  }

  private create() {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.createResponse(request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private update(setting: Response) {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.updateResponse(setting.id, request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private handleChangeResult(result: Response) {
    if (result == null) {
      this.translate.get("RESPONSE.Message.CreateFailure").subscribe(
        msg => this.toast.error(msg)
      )
    } else {
      this.translate.get("RESPONSE.Message.CreateSuccess").subscribe(
        msg => {
          this.toast.success(msg)
          navigateToResponse(this.router)
        }
      )
    }
  }

  cancel() {
    navigateToResponse(this.router)
  }
}
