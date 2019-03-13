export class AttendanceModel {
  idScans: number;
  scan_location: number;
  scan_time: string;
  user_uid: string;
  location_name: string;
  event_start_time: string;
  event_end_time: string;
  event_title: string;
  event_description: string;
  event_type: string;
  hackathon_id: string;
  hackathon_name: string;
  hackathon_start_time: string;
  hackathon_end_time: string;
  hackathon_base_pin: number;
  hackathon_active: number;
}