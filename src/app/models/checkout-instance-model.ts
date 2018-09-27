import { ItemCheckoutModel } from './item-checkout-model';
import { RegistrationModel } from './registration-model';

export class CheckoutInstanceModel {
  public uid: string;
  public checkout_time: Date;
  public return_time: Date;
  public hackathon: string;
  public checkoutItem: ItemCheckoutModel;
  public user: RegistrationModel;

  static parseFromJson(json: any) {
    const parsed = new CheckoutInstanceModel();
    parsed.uid = json.checkout_uid;
    parsed.checkout_time = new Date(parseInt(json.checkout_time, 10));
    parsed.return_time = json.return_time ? new Date(parseInt(json.return_time, 10)) : null;
    parsed.hackathon = json.checkout_hackathon;
    parsed.checkoutItem = ItemCheckoutModel.parseFromJson(json);
    parsed.user = new RegistrationModel();
    parsed.user.uid = json.user_uid;
    parsed.user.name = `${json.user_firstname} ${json.user_lastname}`;
    return parsed;
  }
}
