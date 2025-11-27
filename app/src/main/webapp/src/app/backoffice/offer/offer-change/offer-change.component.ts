import {Component, Input} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Location} from "@angular/common";
import {HotToastService} from "@ngneat/hot-toast";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {OfferService} from "../model/offer.service";
import {Offer, OfferChangeForm, OfferChangeRequest} from "../model/offer-api";
import * as moment from "moment/moment";
import {Moment} from "moment/moment";

@Component({
  selector: 'app-offer-change',
  templateUrl: './offer-change.component.html',
  styleUrls: ['./offer-change.component.scss']
})
export class OfferChangeComponent {

  title: string = "OFFER.CHANGE.Create";
  reloading: boolean = false

  @Input() data: Offer | null = null


  form: FormGroup = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      finishTime: ['', Validators.required],
      maxPersons: ['', Validators.required],
      active: ['', Validators.required],
    }
  )


  constructor(
    private fb: FormBuilder,
    private location: Location,
    private service: OfferService,
    private toastService: HotToastService,
    private translationService: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(+id, (e) => this.handleDataEdit(e))
    } else if (this.data) {
      this.handleDataEdit(this.data)
    } else {
      this.handleDataCreate()
    }
  }


  private loadData(offerId: number, callback: (e: Offer) => void) {
    this.reloading = true;
    this.service.getOffer(offerId).subscribe(data => callback(data));
  }

  private handleDataCreate() {
    this.data = null;
    this.translationService.get("OFFER.CHANGE.Create").subscribe(text => this.title = text);
  }

  private handleDataEdit(data: Offer) {
    this.data = data;
    this.initValues(data);
    this.translationService.get("OFFER.CHANGE.Update", {offer: data.id}).subscribe(text => this.title = text);
    this.validateForm();
    this.reloading = false;
  }


  private initValues(data: Offer) {
    let start = moment(data.start)
    let finish = moment(data.finish)

    this.setValue(start, this.form.get('startTime')!!, this.form.get('date')!!)
    this.setValue(finish, this.form.get('finishTime')!!, this.form.get('date')!!)

    this.form.get('maxPersons')?.setValue(data.maxPersons)
    this.form.get('active')?.setValue(data.active)
  }

  private setValue(date: Moment, timeControl: AbstractControl, dateControl: AbstractControl) {
    let timeVal = date.format("HH:mm");
    let dateVal = date;

    timeControl.setValue(timeVal);
    dateControl.setValue(dateVal);
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

    this.reloading = true;
    if (this.data == null) {
      this.create()
    } else {
      this.update(this.data)
    }
  }

  cancel() {
    this.location.back()
  }

  private get request(): OfferChangeRequest | null {
    let value = this.form.value as OfferChangeForm
    let date = value.date
    let startTime = value.startTime
    let finishTime = value.finishTime

    let startDateTime = this.service.createDateTime(startTime, date)?.format("YYYY-MM-DD[T]HH:mm:ss")
    let finishDateTime = this.service.createDateTime(finishTime, date)?.format("YYYY-MM-DD[T]HH:mm:ss")
    let maxPersons = value.maxPersons
    let active = value.active
    if (!startDateTime || !finishDateTime) return null
    return new OfferChangeRequest(
      startDateTime,
      finishDateTime,
      maxPersons,
      active
    )
  }

  private create() {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.createOffer(request).subscribe((result) => this.handleCreateResult(result))
    }
  }

  private showFormInvalidError() {
    this.translationService.get("OFFER.Message.FormInvalid").subscribe(
      msg => this.toastService.error(msg)
    )
  }

  private update(offer: Offer) {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.updateOffer(offer.id, request).subscribe((result) => this.handleCreateResult(result))
    }
  }

  private handleCreateResult(result: Offer) {
    if (result == null) {
      this.translationService.get("OFFER.Message.CreateFailure").subscribe(
        msg => this.toastService.error(msg)
      )
    } else {
      this.translationService.get("OFFER.Message.CreateSuccess").subscribe(
        msg => {
          this.toastService.success(msg)
          this.router.navigate(["/backoffice/offer"]).then()
        }
      )
    }
  }
}
