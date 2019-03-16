import { IHackerRegistrationModel } from './hacker-registration-model';

export interface IEventStatisticsModel {
  event_description: string,
  event_end_time: string,
  event_start_time: string,
  event_title: string,
  event_type: string,
  event_uid: string,
  attendees: IHackerRegistrationModel[],
}
