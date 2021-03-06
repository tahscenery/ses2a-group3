import { Interest } from "./interest";
import { handleResponse } from "./utils";

export type User = {
  _id: string;
  admin: boolean;
  name: string;
  email: string;
  created: string;
  lastUpdated: string;
  about: string;
  interests: string[];
};

export type CreateUserParams = {
  name: string;
  email: string;
  password: string;
  about: string;
  interests: string[];
};

export async function createUser(user: CreateUserParams): Promise<User> {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    return await handleResponse<User>(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}

export type ReadUserParams = { _id: string; token: string };

export async function readUser(params: ReadUserParams): Promise<User> {
  try {
    const response = await fetch(`/api/users/${params._id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
    });

    return await handleResponse<User>(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}

export type UpdateUserParams = {
  admin?: boolean;
  name?: string;
  email?: string;
  password?: string;
  about?: string;
  interests?: Interest[];
};
export type UpdateUserResult = {
  _id: string;
};

export async function updateUser(
  id: string,
  token: string,
  params: UpdateUserParams
): Promise<UpdateUserResult> {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(params),
    });

    return await handleResponse<UpdateUserResult>(response);
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}

export type DeleteUserResult = { _id: string };

export async function deleteUser(
  id: string,
  token: string
): Promise<DeleteUserResult> {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error.message || error);
    throw error;
  }
}
