import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {TranslatePipe} from "@ngx-translate/core";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {PortalBooking} from "@open-booking/portal";
import {BookingStatus, VisitorResizeRequest} from "@open-booking/core";

@Component({
  selector: 'app-booking-resize-dialog',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    TranslatePipe
  ],
  templateUrl: './booking-resize-dialog.component.html',
  styleUrl: './booking-resize-dialog.component.scss',
})
export class BookingResizeDialogComponent {
  private dialogRef = inject(MatDialogRef<BookingResizeDialogComponent>)
  data = inject<PortalBooking>(MAT_DIALOG_DATA)

  form = inject(FormBuilder).group({
    size: [this.data.visitor.size, [Validators.required, Validators.min(1), Validators.max(this.data.offer.maxPersons)]],
    minAge: [this.data.visitor.minAge, [Validators.required, Validators.min(0)]],
    maxAge: [this.data.visitor.maxAge, [Validators.required, Validators.min(0)]]
  });

  get isIncreasing() {
    return (this.form.get('size')?.value || 0) > this.data.visitor.size;
  }

  constructor() {
    // Sync ages when size is 1
    this.form.get('minAge')?.valueChanges.subscribe(value => {
      if (this.form.get('size')?.value === 1) {
        this.form.get('maxAge')?.setValue(value, {emitEvent: false});
      }
    });
  }

  confirm() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value as VisitorResizeRequest)
    }
  }

  protected readonly BookingStatus = BookingStatus;
}
