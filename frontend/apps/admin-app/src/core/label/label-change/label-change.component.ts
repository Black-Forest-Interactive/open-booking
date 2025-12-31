import {Component, effect, inject, model, resource, signal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {navigateToLabel} from "../../../app/app.navigation";
import {Label, LabelChangeRequest} from "@open-booking/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {LabelService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-label-change',
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslatePipe,
    LoadingBarComponent
  ],
  templateUrl: './label-change.component.html',
  styleUrl: './label-change.component.scss',
})
export class LabelChangeComponent {
  private route = inject(ActivatedRoute)
  id = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))

  private labelResource = resource({
    params: this.id,
    loader: param => toPromise(this.service.getLabel(param.params), param.abortSignal)
  })

  data = model<Label | null>(null)
  title = signal('LABEL.CHANGE.Create')
  reloading = signal(false)

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private service: LabelService,
    private toast: HotToastService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.form = this.fb.group({
        name: ['', Validators.required],
        color: ['#000000', Validators.required],
        priority: [1, Validators.required]
      }
    )
    effect(() => {
      const value = this.labelResource.value()
      if (value) this.handleDataEdit(value)
    })
  }

  private handleDataEdit(data: Label) {
    this.data.set(data)
    this.initValues(data)
    this.translate.get("LABEL.CHANGE.Update", {offer: data.id}).subscribe(text => this.title = text)
    this.validateForm()
  }

  private initValues(data: Label) {
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
    this.translate.get("LABEL.Message.FormInvalid").subscribe(
      msg => this.toast.error(msg)
    )
  }

  private get request(): LabelChangeRequest | null {
    return this.form.value
  }

  private create() {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.createLabel(request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private update(setting: Label) {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.updateLabel(setting.id, request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private handleChangeResult(result: Label) {
    if (result == null) {
      this.translate.get("LABEL.Message.CreateFailure").subscribe(
        msg => this.toast.error(msg)
      )
    } else {
      this.translate.get("LABEL.Message.CreateSuccess").subscribe(
        msg => {
          this.toast.success(msg)
          navigateToLabel(this.router)
        }
      )
    }
  }

  cancel() {
    navigateToLabel(this.router)
  }
}
