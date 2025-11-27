import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RequestRoutingModule} from './request-routing.module';
import {RequestBoardComponent} from './request-board/request-board.component';
import {MaterialModule} from "../../material/material.module";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {RequestBoardVisitorGroupCellComponent} from './request-board-visitor-group-cell/request-board-visitor-group-cell.component';
import {RequestBoardBookingCellComponent} from './request-board-booking-cell/request-board-booking-cell.component';
import {QuillModule} from "ngx-quill";
import {RequestProcessDialogComponent} from './request-process-dialog/request-process-dialog.component';
import {RequestCommentDialogComponent} from './request-comment-dialog/request-comment-dialog.component';
import {VisitorGroupModule} from "../visitor-group/visitor-group.module";
import { RequestCreateComponent } from './request-create/request-create.component';
import { RequestChangeResultComponent } from './request-change-result/request-change-result.component';


@NgModule({
  declarations: [
    RequestBoardComponent,
    RequestBoardVisitorGroupCellComponent,
    RequestBoardBookingCellComponent,
    RequestProcessDialogComponent,
    RequestCommentDialogComponent,
    RequestCreateComponent,
    RequestChangeResultComponent
  ],
    imports: [
        CommonModule,
        RequestRoutingModule,
        MaterialModule,
        TranslateModule,
        ReactiveFormsModule,
        QuillModule,
        VisitorGroupModule
    ]
})
export class RequestModule {
}
