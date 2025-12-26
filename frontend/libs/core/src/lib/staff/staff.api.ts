export interface StaffMember {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  mobile: string
}

export class StaffMemberChangeRequest {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public phone: string,
    public mobile: string
  ) {
  }

}
