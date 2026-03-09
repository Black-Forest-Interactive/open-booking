import {Component, inject} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";
import {Booking} from "@open-booking/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-booking-comment-dialog',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TranslatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './booking-comment-dialog.component.html',
  styleUrl: './booking-comment-dialog.component.scss',
})
export class BookingCommentDialogComponent {
  data = inject<Booking>(MAT_DIALOG_DATA)

  form: FormGroup

  constructor(fb: FormBuilder, private reference: MatDialogRef<BookingCommentDialogComponent>) {
    this.form = fb.group({
        comment: [this.data.comment, Validators.required]
      }
    )
  }

  protected onSubmit() {
    if (!this.form.valid) return
    let value = this.form.value

    this.reference.close(value.comment)
  }

  protected cancel() {
    this.reference.close(null)
  }
}
