import {Component, computed, input} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslatePipe} from "@ngx-translate/core";
import {BookingDetails} from "@open-booking/core";
import {RouterLink} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-reservation-edit-button',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './reservation-edit-button.component.html',
  styleUrl: './reservation-edit-button.component.scss',
})
export class ReservationEditButtonComponent {
  entry = input.required<BookingDetails>()
  currentUserId = input<string>('')

  id = computed(() => this.entry().booking.id)
  editor = computed(() => this.entry().editor)
  userName = computed(() => this.editor()?.userName ?? '')
  isCurrentUser = computed(() => this.entry().editor?.userId === this.currentUserId())
  editedBySomeoneElse = computed(() => this.editor() && !this.isCurrentUser())


}
