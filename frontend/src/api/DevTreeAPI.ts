import { isAxiosError } from "axios";
import api from "../config/axios";
import type { UserType } from "../types";

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
