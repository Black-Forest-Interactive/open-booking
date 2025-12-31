import {Component, effect, inject, model, resource, signal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {GuideService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Guide, GuideChangeRequest} from "@open-booking/core";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {navigateToGuide} from "../../../app/app.navigation";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-guide-change',
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    LoadingBarComponent,
    TranslatePipe
  ],
  templateUrl: './guide-change.component.html',
  styleUrl: './guide-change.component.scss',
})
export class GuideChangeComponent {
  private route = inject(ActivatedRoute)
  id = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))

  private guideResource = resource({
    params: this.id,
    loader: param => toPromise(this.service.getGuide(param.params), param.abortSignal)
  })

  data = model<Guide | null>(null)
  title = signal('GUIDE.CHANGE.Create')
  reloading = signal(false)

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private service: GuideService,
    private toast: HotToastService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.form = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.email],
        phone: [''],
        mobile: ['']
      }
    )
    effect(() => {
      const value = this.guideResource.value()
      if (value) this.handleDataEdit(value)
    })
  }

  private handleDataEdit(data: Guide) {
    this.data.set(data)
    this.initValues(data)
    this.translate.get("GUIDE.CHANGE.Update", {offer: data.id}).subscribe(text => this.title = text)
    this.validateForm()
  }

  private initValues(data: Guide) {
    this.form.patchValue(data)
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
    this.translate.get("GUIDE.Message.FormInvalid").subscribe(
      msg => this.toast.error(msg)
    )
  }

  private get request(): GuideChangeRequest | null {
    return this.form.value
  }

  private create() {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.createGuide(request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private update(setting: Guide) {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.updateGuide(setting.id, request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private handleChangeResult(result: Guide) {
    if (result == null) {
      this.translate.get("GUIDE.Message.CreateFailure").subscribe(
        msg => this.toast.error(msg)
      )
    } else {
      this.translate.get("GUIDE.Message.CreateSuccess").subscribe(
        msg => {
          this.toast.success(msg)
          navigateToGuide(this.router)
        }
      )
    }
  }

  cancel() {
    navigateToGuide(this.router)
  }
}
