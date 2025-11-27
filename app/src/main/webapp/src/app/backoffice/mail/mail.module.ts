import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MailRoutingModule } from './mail-routing.module';
import { MailBoardComponent } from './mail-board/mail-board.component';
import {MaterialModule} from "../../material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import { MailHistoryComponent } from './mail-history/mail-history.component';


@NgModule({
  declarations: [
    MailBoardComponent,
    MailHistoryComponent
  ],
  imports: [
    CommonModule,
    MailRoutingModule,
    MaterialModule,
    TranslateModule,
    ReactiveFormsModule,
  ]
})
export class MailModule { }
