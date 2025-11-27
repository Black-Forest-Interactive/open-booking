import {Component, EventEmitter, Input, Output} from '@angular/core';
import {defaultVisitorGroup, VisitorGroup, VisitorGroupChangeRequest} from "../model/visitor-group-api";
import {FormBuilder, Validators} from "@angular/forms";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {Address} from "../../../visitor-group/model/visitor-group-api";

@Component({
  selector: 'app-visitor-group-change',
  templateUrl: './visitor-group-change.component.html',
  styleUrls: ['./visitor-group-change.component.scss'],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]
})
export class VisitorGroupChangeComponent {

  @Input()
  get data(): any {
    return this._data;
  }

  set data(value: VisitorGroup) {
    this._data = value;
    this.initValued()
  }

  _data: VisitorGroup = defaultVisitorGroup

  @Output() changeEvent = new EventEmitter<VisitorGroupChangeRequest | undefined>()

  form = this.fb.group({
    title: ['', Validators.required],
    size: ['', [Validators.required, Validators.min(1)]],
    group: [false],
    minAge: ['', [Validators.required, Validators.min(0)]],
    maxAge: ['', [Validators.required, Validators.min(0)]],
    contact: ['', Validators.required],
    street: [''],
    zip: [''],
    city: [''],
    phone: ['', Validators.required],
    mail: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initValued();
  }

  private initValued() {
    this.form.get('title')?.setValue(this.data.title)
    this.form.get('size')?.setValue(this.data.size + '')
    this.form.get('group')?.setValue(this.data.isGroup)
    this.form.get('minAge')?.setValue(this.data.minAge + '')
    this.form.get('maxAge')?.setValue(this.data.maxAge + '')
    this.form.get('contact')?.setValue(this.data.contact)
    this.form.get('street')?.setValue(this.data.address.street)
    this.form.get('zip')?.setValue(this.data.address.zip)
    this.form.get('city')?.setValue(this.data.address.city)
    this.form.get('phone')?.setValue(this.data.phone)
    this.form.get('mail')?.setValue(this.data.email)
  }

  get size() {
    return this.form.get('size')
  }

  cancel() {
    this.changeEvent.emit(undefined)
  }

  submit() {
    if (this.form.invalid) return
    let value = this.form.value

    let request = new VisitorGroupChangeRequest(
      value.title!!,
      +value.size!!,
      value.group!!,
      +value.minAge!!,
      +value.maxAge!!,
      value.contact!!,
      new Address(value.street!!, value.city!!, value.zip!!),
      value.phone!!,
      value.mail!!
    )
    this.changeEvent.emit(request)
  }

}
