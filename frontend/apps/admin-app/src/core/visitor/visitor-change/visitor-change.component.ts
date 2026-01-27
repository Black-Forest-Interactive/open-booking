import {Component, forwardRef} from '@angular/core';
import {VisitorType} from "@open-booking/core";
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators
} from "@angular/forms";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-visitor-change',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './visitor-change.component.html',
  styleUrl: './visitor-change.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VisitorChangeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => VisitorChangeComponent),
      multi: true
    }
  ]
})
export class VisitorChangeComponent implements ControlValueAccessor, Validator {

  private onChange: (value: any) => void = () => {
  }
  private onTouched: () => void = () => {
  }

  form: FormGroup

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      type: [VisitorType.SINGLE, Validators.required],
      title: [''],
      description: [''],
      size: [1, [Validators.required, Validators.min(1)]],
      minAge: ['', [Validators.required, Validators.min(0)]],
      maxAge: ['', [Validators.required, Validators.min(0)]],
      name: ['', Validators.required],
      zip: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]],
    })

    this.setupValidationRules()

    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        this.onChange(value)
        this.onTouched()
      })
  }

  private setupValidationRules(): void {
    // Rule 1: Title required when GROUP selected
    this.form.get('type')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(type => {
        const titleControl = this.form.get('title')

        if (type === VisitorType.GROUP) {
          titleControl?.setValidators([Validators.required])
        } else {
          titleControl?.clearValidators()
        }

        titleControl?.updateValueAndValidity()
      });

    // Rule 2: Copy minAge to maxAge when size == 1
    this.form.get('size')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(size => {
        if (size === 1) {
          const minAge = this.form.get('minAge')?.value
          if (minAge) {
            this.form.get('maxAge')?.setValue(minAge, {emitEvent: false})
          }
        }
      });

    this.form.get('minAge')?.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(minAge => {
        const size = this.form.get('size')?.value
        if (size === 1) {
          this.form.get('maxAge')?.setValue(minAge, {emitEvent: false})
        }
      });
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (value) {
      this.form.setValue(value, {emitEvent: false});
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  // Validator implementation
  validate(): ValidationErrors | null {
    return this.form.valid ? null : {visitorForm: true};
  }

  protected get size() {
    return this.form.get('size')
  }

  protected get type() {
    return this.form.get('type')
  }

  protected readonly VisitorType = VisitorType;
}
