import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ResponseRoutingModule} from './response-routing.module';
import {ResponseBoardComponent} from './response-board/response-board.component';
import {MaterialModule} from "../../material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ResponseChangeComponent} from './response-change/response-change.component';
import {ResponseDetailsComponent} from './response-details/response-details.component';
import {ResponseDeleteDialogComponent} from './response-delete-dialog/response-delete-dialog.component';
import {QuillModule} from "ngx-quill";


@NgModule({
  declarations: [
    ResponseBoardComponent,
    ResponseChangeComponent,
    ResponseDetailsComponent,
    ResponseDeleteDialogComponent
  ],
  imports: [
    CommonModule,
    ResponseRoutingModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
    QuillModule,
    FormsModule
  ]
})
export class ResponseModule {
}
