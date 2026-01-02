import {Component, computed, inject, resource} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {OfferChangeRequest, OfferInfo} from "@open-booking/core";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {TranslatePipe} from "@ngx-translate/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {DateTime} from "luxon";
import {GuideService, LabelService, OfferService} from "@open-booking/admin";
import {toPromise} from "@open-booking/shared";
import {MatSelectModule} from "@angular/material/select";
import {MatDividerModule} from "@angular/material/divider";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-offer-edit-dialog',
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './offer-edit-dialog.component.html',
  styleUrl: './offer-edit-dialog.component.scss',
})
export class OfferEditDialogComponent {
  data: OfferInfo = inject<OfferInfo>(MAT_DIALOG_DATA)
  form: FormGroup

  private labelResource = resource({
    loader: (param) => toPromise(this.labelService.getAllLabelSorted(), param.abortSignal)
  })
  labels = computed(() => this.labelResource.value() ?? [])

  private guideResource = resource({
    loader: (param) => toPromise(this.guideService.getAllGuide(0, 100), param.abortSignal)
  })
  guides = computed(() => this.guideResource.value()?.content ?? [])

  reloading = computed(() => this.labelResource.isLoading() || this.guideResource.isLoading())

  constructor(
    private fb: FormBuilder,
    private service: OfferService,
    private labelService: LabelService,
    private guideService: GuideService,
    private dialogRef: MatDialogRef<OfferEditDialogComponent>
  ) {
    this.form = this.fb.group({
        date: ['', Validators.required],
        startTime: ['', Validators.required],
        finishTime: ['', Validators.required],
        maxPersons: ['', Validators.required],
        active: ['', Validators.required],
        label: [''],
        guide: [''],
      }
    )

    let data = this.data
    let start = DateTime.fromISO(data.offer.start)
    let finish = DateTime.fromISO(data.offer.finish)

    this.form.patchValue({
      date: start,
      startTime: start.toFormat("HH:mm"),
      finishTime: finish.toFormat("HH:mm"),
      maxPersons: data.offer.maxPersons,
      active: data.offer.active,
      label: data.label?.id,
      guide: data.guide?.id
    })
  }

  private get request(): OfferChangeRequest | null {
    let value = this.form.value
    let date = value.date
    let startTime = value.startTime
    let finishTime = value.finishTime

    let startDateTime = this.service.createDateTime(startTime, date)?.toISO({includeOffset: false})
    let finishDateTime = this.service.createDateTime(finishTime, date)?.toISO({includeOffset: false})
    let maxPersons = value.maxPersons
    let active = value.active
    if (!startDateTime || !finishDateTime) return null
    return new OfferChangeRequest(
      startDateTime,
      finishDateTime,
      maxPersons,
      active,
      +(value.label),
      +(value.guide)
    )
  }

  onCancel(): void {
    this.dialogRef.close(null)
  }

  onSubmit() {
    let request = this.request
    this.dialogRef.close(request)
  }

  getSelectedLabelColor(): string {
    const selectedLabelId = this.form.get('label')?.value;
    return this.labels().find(label => label.id === selectedLabelId)?.color || '#cccccc';
  }
}
