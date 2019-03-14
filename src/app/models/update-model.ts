export class UpdateModel {
  public updateTitle: string;
  public updateText: string;
  public updateImage: string;
  public pushNotificaiton: boolean;

  constructor(updateTitle: string, updateText: string, updateImage?: string, pushNotificaiton?: boolean) {
    this.updateTitle = updateTitle;
    this.updateText = updateText;
    this.updateImage = updateImage;
    this.pushNotificaiton = pushNotificaiton;
  }
}
