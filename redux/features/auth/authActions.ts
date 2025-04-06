import { createAsyncThunk } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";
import http from "../../http";

export const saveLoginInfo = createAsyncThunk<
  any,
  { token: string; user: any },
  {
    rejectValue: any;
    getState: any;
  }
>("auth/login", async ({ token, user }, { rejectWithValue, getState }) => {
  try {

    const state = getState();

    console.log("DATA", user, token)
    // store user's token in local storage
    secureLocalStorage.setItem("xad", JSON.stringify(user));
    secureLocalStorage.setItem("xak", token);
    return { user, token }
  } catch (error) {
    console.log(error);
    const unknownError = error as any;
    // return custom error message from API if any
    if (unknownError.response && unknownError.response.data.message) {
      return rejectWithValue(unknownError.response.data.message);
    } else {
      return rejectWithValue("An unknown error occured, try again");
    }
  }
});

export const userLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // remove data in local storage
      secureLocalStorage.removeItem("xak");
      secureLocalStorage.removeItem("xad");
    } catch (error) {
    const unknownError = error as any;
    // return custom error message from API if any
      if (unknownError.response && unknownError.response.data.message) {
        return rejectWithValue(unknownError.response.data.message);
      } else {
        return rejectWithValue("An unknown error occured, try again");
      }
    }
  }
);


export const saveAdminInfo = createAsyncThunk<
  any,
  { token: string; admin: any },
  {
    rejectValue: any;
    getState: any;
  }
>("auth/admin/login", async ({ token, admin }, { rejectWithValue, getState }) => {
  try {

    const state = getState();

    console.log("DATA", admin, token)
    // store user's token in local storage
    secureLocalStorage.setItem("xua", JSON.stringify(admin));
    secureLocalStorage.setItem("xuk", token);
    return { admin, token }
  } catch (error) {
    console.log(error);
    const unknownError = error as any;
    // return custom error message from API if any
    if (unknownError.response && unknownError.response.data.message) {
      return rejectWithValue(unknownError.response.data.message);
    } else {
      return rejectWithValue("An unknown error occured, try again");
    }
  }
});

export const adminLogout = createAsyncThunk(
  "auth/admin/logout",
  async (_, { rejectWithValue }) => {
    try {
      // remove data in local storage
      secureLocalStorage.removeItem("xua");
      secureLocalStorage.removeItem("xuk");
    } catch (error) {
    const unknownError = error as any;
    // return custom error message from API if any
      if (unknownError.response && unknownError.response.data.message) {
        return rejectWithValue(unknownError.response.data.message);
      } else {
        return rejectWithValue("An unknown error occured, try again");
      }
    }
  }
);