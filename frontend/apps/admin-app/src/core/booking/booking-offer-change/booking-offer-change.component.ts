import {Component, effect, input} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {BookingDetails, OfferReference} from "@open-booking/core";
import {OfferFinderComponent} from "../../assistant/offer-finder/offer-finder.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {TranslatePipe} from "@ngx-translate/core";
import {MatCard} from "@angular/material/card";

@Component({
  selector: 'app-booking-offer-change',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    OfferFinderComponent,
    TranslatePipe,
    MatCard
  ],
  templateUrl: './booking-offer-change.component.html',
  styleUrl: './booking-offer-change.component.scss',
})
export class BookingOfferChangeComponent {

  data = input.required<BookingDetails>()

  form: FormGroup

  constructor(
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      size: ['', [Validators.required, Validators.min(1)]],
      minAge: ['', [Validators.required, Validators.min(0)]],
      maxAge: ['', [Validators.required, Validators.min(0)]],
      offerId: ['', [Validators.required, Validators.min(1)]]
    })

    effect(() => {
      const booking = this.data()

      this.form.patchValue({
        size: booking.visitor.size,
        minAge: booking.visitor.minAge,
        maxAge: booking.visitor.maxAge,
        offerId: booking.offer.offer.id
      })
    });
  }

  protected get size() {
    return this.form.get('size')
  }

  protected handleOfferSelected(event: OfferReference) {
    this.form.patchValue({offerId: event.offer.id})
  }

}
