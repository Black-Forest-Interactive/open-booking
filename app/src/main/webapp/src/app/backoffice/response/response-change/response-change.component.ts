import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Location} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HotToastService} from "@ngneat/hot-toast";
import {ResponseService} from "../model/response.service";
import {Response, RESPONSE_TYPES, ResponseChangeRequest} from "../model/response-api";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";

@Component({
  selector: 'app-response-change',
  templateUrl: './response-change.component.html',
  styleUrls: ['./response-change.component.scss'],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]
})
export class ResponseChangeComponent {
  title: string = "RESPONSE.CHANGE.Create";
  reloading: boolean = false

  data: Response | null = null
  languages: string[] = []
  htmlText = "<p>Testing</p>"

  types: string[] = RESPONSE_TYPES
  form: FormGroup = this.fb.group({
      lang: [this.translate.currentLang, Validators.required],
      type: [this.types[0], Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required]
    }
  )


  constructor(
    private fb: FormBuilder,
    private location: Location,
    private service: ResponseService,
    private toastService: HotToastService,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.languages = this.translate.langs
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadData(+id, (e) => this.handleDataEdit(e))
    } else {
      this.handleDataCreate()
    }
  }


  private loadData(responseId: number, callback: (e: Response) => void) {
    this.reloading = true;
    this.service.getResponse(responseId).subscribe(data => callback(data));
  }

  private handleDataCreate() {
    this.data = null;
    this.translate.get("RESPONSE.CHANGE.Create").subscribe(text => this.title = text);
  }

  private handleDataEdit(data: Response) {
    this.data = data;
    this.initValues(data);
    this.translate.get("RESPONSE.CHANGE.Update", {offer: data.id}).subscribe(text => this.title = text);
    this.validateForm();
    this.reloading = false;
  }


  private initValues(data: Response) {
    this.form.get('lang')?.setValue(data.lang)
    this.form.get('type')?.setValue(data.type)
    this.form.get('title')?.setValue(data.title)
    this.form.get('content')?.setValue(data.content)
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

  private get request(): ResponseChangeRequest | null {
    return this.form.value
  }

  private create() {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.createResponse(request).subscribe((result) => this.handleCreateResult(result))
    }
  }

  private showFormInvalidError() {
    this.translate.get("RESPONSE.Message.FormInvalid").subscribe(
      msg => this.toastService.error(msg)
    )
  }

  private update(offer: Response) {
    let request = this.request
    if (!request) {
      this.showFormInvalidError()
    } else {
      this.service.updateResponse(offer.id, request).subscribe((result) => this.handleCreateResult(result))
    }
  }

  private handleCreateResult(result: Response) {
    if (result == null) {
      this.translate.get("RESPONSE.Message.CreateFailure").subscribe(
        msg => this.toastService.error(msg)
      )
    } else {
      this.translate.get("RESPONSE.Message.CreateSuccess").subscribe(
        msg => {
          this.toastService.success(msg)
          this.router.navigate(["/backoffice/response"]).then()
        }
      )
    }
  }
}
