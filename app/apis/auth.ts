import axios from "axios";
import qs from "qs";

export const registerUser = async (data: object) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/users/register`,
    data
    // config
  );

  return res;
};
export const verifyUserOtp = async (data: object) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/otp/verify`,
    data
    // config
  );

  return res;
};
export const resendUserOtp = async (userId: string) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/otp/resend?user_id=${userId}&purpose=verification`,
    {data: "data"}
    // config
  );

  return res;
};

export const loginUser = async (data: object) => {
  console.log("my req", data);

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/auth/phone-login`,
    qs.stringify(data), // Convert object to URL-encoded string
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Set the correct content type
      },
    }
  );

  return res;
};

export const forgotPassword = async (phone: string) => {

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/auth/forgot-password`,
    {
      phone
    }
  );

  return res;
};
export const resetUserPassword = async (user_id: string, reset_token: string, new_password: string, confirm_password: string) => {

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/auth/reset-password-with-otp`,
    {
      user_id,
      reset_token,
      new_password,
      confirm_password
    }
  );

  return res;
};
