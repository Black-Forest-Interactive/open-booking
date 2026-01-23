import {Component, inject} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogClose} from "@angular/material/dialog";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-booking-comment-dialog',
  imports: [MatIconModule, MatButtonModule, MatDialogClose, TranslatePipe],
  templateUrl: './booking-comment-dialog.component.html',
  styleUrl: './booking-comment-dialog.component.scss',
})
export class BookingCommentDialogComponent {
  data = inject(MAT_DIALOG_DATA)
}
