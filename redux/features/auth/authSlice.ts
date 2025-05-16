import { createSlice } from "@reduxjs/toolkit";
import secureLocalStorage from "react-secure-storage";
import { saveAdminInfo, saveLoginInfo, userLogout, adminLogout} from "./authActions";

// initialize userToken from local storage
const userToken = secureLocalStorage.getItem("xak")
  ? secureLocalStorage.getItem("xak")
  : null;

  const adminToken = secureLocalStorage.getItem("xuk")
  ? secureLocalStorage.getItem("xuk")
  : null;
  
// First, safely get the value from storage
const profileData = secureLocalStorage.getItem("xad");

// Check if the data exists and is not "undefined" string
const hasProfile = profileData !== null && 
                   profileData !== undefined && 
                   profileData !== "undefined" &&
                   profileData !== "";

// Parse the data safely
let profileInfo = null;
if (hasProfile) {
  try {
    profileInfo = JSON.parse(profileData as string);
  } catch (error) {
    console.log("Failed to parse profile data:", error);
    // You could also set a flag to indicate there was an error
    // setParseError(true);
  }
}
  const hasAdminProfile = secureLocalStorage.getItem("xua") !== "undefined";
const adminInfo = hasAdminProfile
  ? JSON.parse(secureLocalStorage.getItem("xua") as string)
  : null;

const initialState = {
  loading: false,
  profileInfo,
  adminInfo,
  userToken,
  adminToken,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // builder.addCase(userLogin.pending, (state, { payload }) => {
    //   state.loading = true;
    //   state.error = null;
    // });

    builder.addCase(saveLoginInfo.fulfilled, (state, { payload }) => {
      // console.log("d", payload);
      state.loading = false;
      state.profileInfo = payload.user;
      state.userToken = payload.token;
      console.log("d",  state.profileInfo, '->', payload.user);

    });

    // builder.addCase(userLogin.rejected, (state, { payload }) => {
    //   console.log("err", payload);
    //   state.loading = false;
    //   state.error = payload;
    // });
    // logout user reducer...
    builder.addCase(userLogout.fulfilled, (state) => {
      state.profileInfo = null;
      state.userToken = null;
    });


    builder.addCase(saveAdminInfo.fulfilled, (state, { payload }) => {
      // console.log("d", payload);
      state.loading = false;
      state.adminInfo = payload.admin;
      state.adminToken = payload.token;
      console.log("d",  state.profileInfo, '->', payload.admin);
    });

    builder.addCase(adminLogout.fulfilled, (state) => {
      state.adminInfo = null;
      state.adminToken = null;
    });



  },

  
  //   extraReducers: {
  //     // login user
  //     [userLogin.pending]: (state) => {
  //       state.loading = true
  //       state.error = null
  //     },
  //     [userLogin.fulfilled]: (state, { payload }) => {
  //       console.log('d', payload)
  //       state.loading = false
  //       state.profileInfo = payload.data
  //       state.userToken = payload.token.token
  //     },
  //     [userLogin.rejected]: (state, { payload }) => {
  //       console.log('err', payload)
  //       state.loading = false
  //       state.error = payload
  //     },
  //     // logout user reducer...
  //     [adminLogOut.fulfilled]: (state) => {
  //       state.profileInfo = null
  //       state.userToken = null
  //     },
  //   },
});
export default authSlice.reducer;
