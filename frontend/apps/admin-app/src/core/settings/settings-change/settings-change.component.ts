import {Component, effect, inject, model, resource, signal} from '@angular/core';
import {Setting, SettingChangeRequest} from "@open-booking/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HotToastService} from "@ngxpert/hot-toast";
import {SettingsService} from "@open-booking/admin";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {navigateToSettings} from "../../../app/app.navigation";

@Component({
  selector: 'app-settings-change',
  imports: [
    LoadingBarComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatInputModule,
    TranslatePipe
  ],
  templateUrl: './settings-change.component.html',
  styleUrl: './settings-change.component.scss',
})
export class SettingsChangeComponent {
  private route = inject(ActivatedRoute)
  id = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))

  private settingResource = resource({
    params: this.id,
    loader: param => toPromise(this.service.getSetting(param.params), param.abortSignal)
  })


  data = model<Setting | null>(null)
  title = signal('SETTING.CHANGE.Create')
  reloading = signal(false)

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private service: SettingsService,
    private toast: HotToastService,
    private translate: TranslateService,
    private router: Router
  ) {
    this.form = this.fb.group({
        key: ['', Validators.required],
        value: ['', Validators.required],
        type: ['', Validators.required]
      }
    )
    effect(() => {
      const setting = this.settingResource.value()
      if (setting) this.handleDataEdit(setting)
    })
  }

  private handleDataEdit(data: Setting) {
    this.data.set(data)
    this.initValues(data)
    this.translate.get("SETTING.CHANGE.Update", {setting: data.id}).subscribe(text => this.title = text)
    this.validateForm()
  }

  private initValues(data: Setting) {
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
    this.translate.get("SETTING.Message.FormInvalid").subscribe(
      msg => this.toast.error(msg)
    )
  }

  private get request(): SettingChangeRequest | null {
    this.form.controls['key'].enable()
    this.form.controls['type'].enable()
    return this.form.value
  }

  private create() {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.createSetting(request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private update(setting: Setting) {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.updateSetting(setting.id, request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private handleChangeResult(result: Setting) {
    if (result == null) {
      this.translate.get("SETTING.Message.CreateFailure").subscribe(
        msg => this.toast.error(msg)
      )
    } else {
      this.translate.get("SETTING.Message.CreateSuccess").subscribe(
        msg => {
          this.toast.success(msg)
          navigateToSettings(this.router)
        }
      )
    }
  }

  cancel() {
    navigateToSettings(this.router)
  }

}
