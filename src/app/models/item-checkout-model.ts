import { Resteable } from './interfaces/resteable';

export class ItemCheckoutModel implements Resteable {
  public availability: Number;
  public uid: string;
  public name: string;
  public quantity: Number;

  static parseFromJson(json: any) {
    const parsed = new ItemCheckoutModel();
    parsed.uid = json.uid;
    parsed.name = json.name;
    parsed.quantity = json.quantity;
    parsed.availability = json.available;
    return parsed;
  }

  restRepr() {
    return {
      name: this.name,
      quantity: this.quantity,
    };
  }
}
