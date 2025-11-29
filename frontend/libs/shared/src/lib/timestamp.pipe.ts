import {Pipe, PipeTransform} from '@angular/core';
import * as moment from "moment";

@Pipe({
  name: 'timestamp'
})
export class TimestampPipe implements PipeTransform {
  constructor() {
    moment.locale("de");
  }

  transform(value: string, ...args: unknown[]): string {
    const timestamp = moment(value);
    return timestamp.format('LT');
  }

}
