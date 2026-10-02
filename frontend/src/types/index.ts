export type UserType = {
  handle: string;
  name: string;
  email: string;
  _id: string;
  description: string;
  image: string;
  links: string;
};

export type RegisterData = Pick<UserType, "handle" | "email" | "name"> & {
  password: string;
  confirmPassword: string;
};

export type LoginData = Pick<RegisterData, "email" | "password">;

export type ProfileData = Pick<UserType, "handle" | "description">;

export type SocialType = {
  id: number;
  name: string;
  url: string;
  enabled: boolean;
};

export type DevTreeLinkType = Pick<SocialType, "name" | "url" | "enabled">;

export type HandleType = Pick<
  UserType,
  "description" | "handle" | "image" | "links" | "name"
>;
