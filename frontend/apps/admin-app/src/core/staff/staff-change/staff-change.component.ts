import {Component, effect, inject, model, resource, signal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {StaffService} from "@open-booking/admin";
import {HotToastService} from "@ngxpert/hot-toast";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {StaffMember, StaffMemberChangeRequest} from "@open-booking/core";
import {LoadingBarComponent, toPromise} from "@open-booking/shared";
import {navigateToStaff} from "../../../app/app.navigation";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-staff-change',
  imports: [
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    LoadingBarComponent,
    TranslatePipe
  ],
  templateUrl: './staff-change.component.html',
  styleUrl: './staff-change.component.scss',
})
export class StaffChangeComponent {
  private route = inject(ActivatedRoute)
  id = toSignal(this.route.paramMap.pipe(map(param => +(param.get('id') ?? ''))))

  private staffResource = resource({
    params: this.id,
    loader: param => toPromise(this.service.getStaffMember(param.params), param.abortSignal)
  })

  data = model<StaffMember | null>(null)
  title = signal('STAFF.CHANGE.Create')
  reloading = signal(false)

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private service: StaffService,
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
      const value = this.staffResource.value()
      if (value) this.handleDataEdit(value)
    })
  }

  private handleDataEdit(data: StaffMember) {
    this.data.set(data)
    this.initValues(data)
    this.translate.get("STAFF.CHANGE.Update", {offer: data.id}).subscribe(text => this.title = text)
    this.validateForm()
  }

  private initValues(data: StaffMember) {
    this.form.setValue(data)
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
    this.translate.get("STAFF.Message.FormInvalid").subscribe(
      msg => this.toast.error(msg)
    )
  }

  private get request(): StaffMemberChangeRequest | null {
    return this.form.value
  }

  private create() {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.createStaffMember(request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private update(setting: StaffMember) {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.updateStaffMember(setting.id, request).subscribe((result) => this.handleChangeResult(result))
    }
  }

  private handleChangeResult(result: StaffMember) {
    if (result == null) {
      this.translate.get("STAFF.Message.CreateFailure").subscribe(
        msg => this.toast.error(msg)
      )
    } else {
      this.translate.get("STAFF.Message.CreateSuccess").subscribe(
        msg => {
          this.toast.success(msg)
          navigateToStaff(this.router)
        }
      )
    }
  }

  cancel() {
    navigateToStaff(this.router)
  }
}
