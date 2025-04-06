import { createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";
import { enlistTractor, tractorOnboarding } from "./userActions";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {

    builder.addCase(tractorOnboarding.pending, (state, { payload }) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(tractorOnboarding.fulfilled, (state, { payload }) => {
      // console.log("d", payload);
      state.loading = false;
      state.success = true;
      console.log("Result", '->', payload);

    });

    builder.addCase(tractorOnboarding.rejected, (state, { payload }) => {
      console.log("err", payload);
      state.loading = false;
      state.error = payload;
    });


    builder.addCase(enlistTractor.pending, (state, { payload }) => {
        state.loading = true;
        state.error = null;
      });
  
      builder.addCase(enlistTractor.fulfilled, (state, { payload }) => {
        // console.log("d", payload);
        state.loading = false;
        state.success = true;
        console.log("Result", '->', payload);
  
      });
  
      builder.addCase(enlistTractor.rejected, (state, { payload }) => {
        console.log("err", payload);
        state.loading = false;
        state.error = payload;
      });

  },
});
export default userSlice.reducer;
