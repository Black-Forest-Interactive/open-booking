import {ChangeEvent} from "@open-booking/core";

export interface EventChangeListener {
  handleEvent(event: ChangeEvent): any
}
