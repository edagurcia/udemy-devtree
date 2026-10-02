import { isAxiosError } from "axios";
import api from "../config/axios";
import type { HandleType, UserType } from "../types";

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

export async function updateUser(formData: UserType) {
  try {
    const { data } = await api.patch<string>("/auth/me", formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response?.data.error);
    }
  }
}

export async function uploadImage(file: File) {
  let formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await api.post("auth/avatar", formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response?.data.error);
    }
  }
}

export async function getUserHandle(handle: string) {
  try {
    const { data } = await api.get<HandleType>(`/${handle}`);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response?.data.error);
    }
  }
}

export async function searchUserHandle(handle: string) {
  try {
    const { data } = await api.post<string>(`search/`, { handle });

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response?.data.error);
    }
  }
}
