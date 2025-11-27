import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TimestampPipe} from "./timestamp.pipe";


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TimestampPipe],
  exports: [TimestampPipe]
})
export class SharedModule {
}
