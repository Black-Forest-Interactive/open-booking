import {VisitorChangeRequest} from "@open-booking/core";

export class CreateReservationRequest {
  constructor(
    public visitor: VisitorChangeRequest,
    public offerIds: number[],
    public comment: string,
    public termsAndConditions: boolean
  ) {
  }
}
