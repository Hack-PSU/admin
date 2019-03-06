export interface IHackerRegistrationModel {
  firstName: string;
  lastName: string;
  gender: string;
  shirtSize: string;
  dietaryRestriction: string | null;
  allergies: string | null;
  travelReimbursement: boolean;
  firstHackathon: boolean;
  university: string;
  email: string;
  academicYear: string;
  major: string;
  phone: string;
  ethnicity: string | null;
  resume: string | null;
  codingExperience: string | null;
  uid: string;
  eighteenBeforeEvent: boolean;
  mlhcoc: boolean;
  mlhdcp: boolean;
  referral: string | null;
  projectDesc: string | null;
  expectations: string | null;
  veteran: string | null;
  hackathon: string;
}
