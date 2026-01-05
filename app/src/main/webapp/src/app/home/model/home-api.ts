import {VisitorGroupChangeRequest} from "../../backoffice/visitor-group/model/visitor-group-api";

export interface UrlResponse {
  url: string
}

export interface TextResponse {
  text: string
}

export class CreateBookingRequest {
  constructor(
    public visitorChangeRequest: VisitorGroupChangeRequest,
    public offerIds: number[],
    public comment: string,
    public termsAndConditions: boolean
  ) {
  }
}
