import { createAsyncThunk } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";
import http from "../../http";
import { RootState } from "../../store";

export const tractorOnboarding = createAsyncThunk<
  any,
  any,
  {
    rejectValue: any;
    getState: any;
  }
>("user/tractor-onboarding", async (body, { rejectWithValue, getState }) => {
  try {
    // const state = getState();
    const state = (getState() as RootState).auth;

    const response = await http.post("/tractor_onboarding", body, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data, response.status)

    return response.data;
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


export const enlistTractor = createAsyncThunk<
  any,
  any,
  {
    rejectValue: any;
    getState: any;
  }
>("user/enlist-tractor", async (body, { rejectWithValue, getState }) => {
  try {
    // const state = getState();
    const state = (getState() as RootState).auth;

    const response = await http.post("/enlist_tractor", body, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data, response.status)
    return response.data;
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
