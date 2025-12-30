import {Pipe, PipeTransform} from '@angular/core';
import {Address} from "@open-booking/core";

@Pipe({
  name: 'address',
})
export class AddressPipe implements PipeTransform {
  transform(value: Address, ...args: unknown[]): string {
    return value.zip + ' ' + value.city + ' ' + value.street;
  }
}
