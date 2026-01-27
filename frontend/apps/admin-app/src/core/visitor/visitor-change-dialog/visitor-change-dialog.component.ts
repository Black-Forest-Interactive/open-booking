import {Component, inject} from '@angular/core';
import {AddressChangeRequest, Visitor, VisitorChangeRequest} from "@open-booking/core";
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {VisitorChangeComponent} from "../visitor-change/visitor-change.component";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-visitor-change-dialog',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule, VisitorChangeComponent, TranslatePipe],
  templateUrl: './visitor-change-dialog.component.html',
  styleUrl: './visitor-change-dialog.component.scss',
})
export class VisitorChangeDialogComponent {
  data = inject<Visitor>(MAT_DIALOG_DATA)

  form: FormGroup

  constructor(
    private fb: FormBuilder,
    private reference: MatDialogRef<VisitorChangeDialogComponent>
  ) {
    this.form = this.fb.group({
      visitor: [{
        type: this.data.type,
        title: this.data.title,
        description: this.data.description,
        size: this.data.size,
        minAge: this.data.minAge,
        maxAge: this.data.maxAge,
        name: this.data.name,
        zip: this.data.address.zip,
        city: this.data.address.city,
        phone: this.data.phone,
        mail: this.data.email,
      }]
    });
  }

  onSave() {

    console.log('Form valid?', this.form.valid);
    console.log('Form value:', this.form.value);
    console.log('Visitor control value:', this.form.get('visitor')?.value);

    if (!this.form.valid) return

    let value = this.form.get('visitor')?.value
    if (!value) return
    console.log('Updated visitor:', value);
    let visitorRequest = new VisitorChangeRequest(
      value.type,
      value.title!!,
      value.description!!,
      +value.size!!,
      +value.minAge!!,
      +value.maxAge!!,
      value.name!!,
      new AddressChangeRequest('', value.city!!, value.zip!!),
      value.phone!!,
      value.mail!!
    )
    this.reference.close(visitorRequest)
  }

  onCancel() {
    this.reference.close(null)
  }

}
