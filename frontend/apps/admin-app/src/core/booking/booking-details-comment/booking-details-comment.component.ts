import {Component, computed, effect, input, output, resource, signal} from '@angular/core';
import {BookingRequestInfo} from "@open-booking/core";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {TranslatePipe} from "@ngx-translate/core";
import {MatInputModule} from "@angular/material/input";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {RequestService} from "@open-booking/admin";
import {toPromise} from "@open-booking/shared";

@Component({
  selector: 'app-booking-details-comment',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    TranslatePipe
  ],
  templateUrl: './booking-details-comment.component.html',
  styleUrl: './booking-details-comment.component.scss',
})
export class BookingDetailsCommentComponent {
  data = input.required<BookingRequestInfo>()
  comment = computed(() => this.data().comment)

  editCommentStatus = signal<'show' | 'edit' | 'updating'>('show')

  private saveTrigger = signal<{ id: number, comment: string } | null>(null)
  private saveResource = resource({
    params: this.saveTrigger,
    loader: (param) => {
      if (!param.params) return Promise.resolve(null)
      this.editCommentStatus.set('updating')
      return toPromise(this.service.setComment(param.params.id, param.params.comment), param.abortSignal)
    }
  })

  change = output<boolean>()

  constructor(private service: RequestService) {
    effect(() => {
      const result = this.saveResource.value()
      if (result) {
        this.editCommentStatus.set('show')
        this.change.emit(true)
      }
    })
  }

  edit() {
    if (this.editCommentStatus() == 'show') this.editCommentStatus.set('edit')
  }

  save(comment: string) {
    if (this.editCommentStatus() !== 'edit') return
    this.saveTrigger.set({id: this.data().id, comment})
  }

  cancel() {
    if (this.editCommentStatus() != 'edit') return
    this.editCommentStatus.set('show')
  }
}
