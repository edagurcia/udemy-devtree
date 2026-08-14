export type UserType = {
  handle: string;
  name: string;
  email: string;
  _id: string;
};

export type RegisterData = Pick<UserType, "handle" | "email" | "name"> & {
  password: string;
  confirmPassword: string;
};

export type LoginData = Pick<RegisterData, "email" | "password">;
