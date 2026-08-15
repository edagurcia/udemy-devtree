import { isAxiosError } from "axios";
import api from "../config/axios";
import type { ProfileData, UserType } from "../types";

export async function getUser() {
  try {
    const { data } = await api.get<UserType>("/auth/me");

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response?.data.error);
    }
  }
}

export async function updateUser(formData: ProfileData) {
  try {
    const { data } = await api.patch<string>("/auth/me", formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response?.data.error);
    }
  }
}
