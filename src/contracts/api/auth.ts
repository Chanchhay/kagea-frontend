import type { ApiResponse, Gender, RegistrationRole } from "./common";

export type RegisterRequest = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  gender?: Gender;
  role: RegistrationRole;
  phoneNumber?: string;
};

export type RegisterResponse = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  role: RegistrationRole;
  phoneNumber: string;
  registrationSource: string;
};

export type CurrentUserProfilesResponse = {
  jobSeekerProfileId?: string;
  recruiterProfileId?: string;
  moderatorProfileId?: string;
  adminProfileId?: string;
  financeProfileId?: string;
};

export type CurrentUserResponse = {
  userAccountId: string;
  keycloakUserId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  registrationSource: string;
  roles: string[];
  /** App-relative avatar URL from whichever profile the account owns. */
  avatarUrl?: string;
  profiles: CurrentUserProfilesResponse;
};

export type ApiResponseCurrentUserResponse = ApiResponse<CurrentUserResponse>;
