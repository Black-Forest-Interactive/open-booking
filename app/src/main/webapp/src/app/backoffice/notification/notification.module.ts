import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NotificationRoutingModule} from './notification-routing.module';
import {NotificationBoardComponent} from './notification-board/notification-board.component';
import {NotificationTemplateChangeComponent} from './notification-template-change/notification-template-change.component';
import {NotificationTemplateBoardComponent} from './notification-template-board/notification-template-board.component';
import {NotificationTemplateDeleteDialogComponent} from './notification-template-delete-dialog/notification-template-delete-dialog.component';
import {NotificationTemplateDetailsComponent} from './notification-template-details/notification-template-details.component';
import {MaterialModule} from "../../material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {QuillModule} from "ngx-quill";


@NgModule({
  declarations: [
    NotificationBoardComponent,
    NotificationTemplateChangeComponent,
    NotificationTemplateBoardComponent,
    NotificationTemplateDeleteDialogComponent,
    NotificationTemplateDetailsComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
    QuillModule,
    FormsModule
  ]
})
export class NotificationModule { }
