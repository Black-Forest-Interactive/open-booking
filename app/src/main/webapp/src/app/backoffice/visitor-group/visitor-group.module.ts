import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VisitorGroupRoutingModule} from './visitor-group-routing.module';
import {VisitorGroupInfoComponent} from './visitor-group-info/visitor-group-info.component';
import {MaterialModule} from "../../material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {VisitorGroupInfoDialogComponent} from "./visitor-group-info-dialog/visitor-group-info-dialog.component";
import { VisitorGroupChangeComponent } from './visitor-group-change/visitor-group-change.component';
import { VisitorGroupStatusComponent } from './visitor-group-status/visitor-group-status.component';


@NgModule({
  declarations: [
    VisitorGroupInfoComponent,
    VisitorGroupInfoDialogComponent,
    VisitorGroupChangeComponent,
    VisitorGroupStatusComponent
  ],
  exports: [
    VisitorGroupInfoComponent,
    VisitorGroupInfoDialogComponent,
    VisitorGroupChangeComponent,
    VisitorGroupStatusComponent
  ],
  imports: [
    CommonModule,
    VisitorGroupRoutingModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
  ]
})
export class VisitorGroupModule {
}
