export class Adjuster {
  public id: number;
  public name: string;
  public emailAddress: string;
  public FCNNum: string;
  public Address: any[];
  public claimCount: number;
  public isSelected: boolean;
  public certs: string[];
  public lat: number;
  public lng: number;
  public City: string;
  public State: string;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
