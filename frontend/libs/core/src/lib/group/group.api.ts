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

export class Address {
  public constructor(
    public street: string,
    public city: string,
    public zip: string,
  ) {
  }
}
