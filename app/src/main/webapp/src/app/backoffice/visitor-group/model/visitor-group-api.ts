import {defaultAddress} from "../../../visitor-group/model/visitor-group-api";

export class Address {
  public constructor(
    public street: string,
    public city: string,
    public zip: string,
  ) {
  }
}

export interface VisitorGroup {
  id: number,
  title: string,
  size: number,
  isGroup: boolean,
  minAge: number,
  maxAge: number,
  contact: string,
  address: Address,
  phone: string,
  email: string,
  status: string
}

export class VisitorGroupChangeRequest {
  public constructor(
    public title: string,
    public size: number,
    public isGroup: boolean,
    public minAge: number,
    public maxAge: number,
    public contact: string,
    public address: Address,
    public phone: string,
    public email: string,
  ) {
  }
}

export const defaultVisitorGroup: VisitorGroup = {
  id: -1,
  title: "",
  size: -1,
  isGroup: false,
  minAge: -1,
  maxAge: -1,
  contact: "",
  address: defaultAddress,
  phone: "",
  email: "",
  status: ""
}

export const VISITOR_GROUP_STATUS_UNKNOWN = 'UNKNOWN'
export const VISITOR_GROUP_STATUS_UNCONFIRMED = 'UNCONFIRMED'
export const VISITOR_GROUP_STATUS_CONFIRMED = 'CONFIRMED'

export const VISITOR_GROUP_STATUS = [
  VISITOR_GROUP_STATUS_UNCONFIRMED,
  VISITOR_GROUP_STATUS_CONFIRMED
]

