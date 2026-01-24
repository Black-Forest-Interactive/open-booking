import {Pipe, PipeTransform} from "@angular/core"
import type {Address} from "@open-booking/core"

@Pipe({
  name: 'address',
  standalone: true,
})
export class AddressPipe implements PipeTransform {
  transform(value: Address): string {
    return `${value.zip} ${value.city} ${value.street}`;
  }
}
