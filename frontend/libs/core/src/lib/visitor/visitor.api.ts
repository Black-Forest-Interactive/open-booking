export interface Visitor {
  id: number,
  type: string,
  title: string,
  description: string,

  size: number,
  minAge: number,
  maxAge: number,

  name: string,
  address: Address,
  phone: string,
  email: string,

  verification: Verification
}

export interface Verification {
  status: string,
  timestamp: string | undefined,
}

export interface Address {
  street: string,
  city: string,
  zip: string
}

export const VisitorType = {
  SINGLE: 'SINGLE',
  GROUP: 'GROUP'
} as const;

export type VisitorType = typeof VisitorType[keyof typeof VisitorType];

export class VisitorChangeRequest {
  public constructor(
    public type: VisitorType,
    public title: string,
    public description: string,
    public size: number,
    public minAge: number,
    public maxAge: number,
    public name: string,
    public address: AddressChangeRequest,
    public phone: string,
    public email: string
  ) {
  }
}

export class AddressChangeRequest {
  public constructor(
    public street: string,
    public city: string,
    public zip: string,
  ) {
  }
}

export const VISITOR_GROUP_STATUS_UNKNOWN = 'UNKNOWN'
export const VISITOR_GROUP_STATUS_UNCONFIRMED = 'UNCONFIRMED'
export const VISITOR_GROUP_STATUS_CONFIRMED = 'CONFIRMED'

export const VISITOR_GROUP_STATUS = [
  VISITOR_GROUP_STATUS_UNCONFIRMED,
  VISITOR_GROUP_STATUS_CONFIRMED
]

