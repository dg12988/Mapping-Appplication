export class ClaimAssignment {
  public assignmentId: number;
  public externalAssignmentId: string;
  public policyNum: string;
  public Address1: string;
  public Address2: string;
  public City: string;
  public State: string;
  public Zipcode: string;
  public lat: string;
  public lng: string;
  public isSelected: boolean;
  public isSubmitted: boolean;
  public isHidden: boolean;
  public selectedAdj: string;
  public policyType: string;
  public filterString: string;
  public wasRejected: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
