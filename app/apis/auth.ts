import axios from "axios";
import qs from 'qs';

export const registerUser = async (
    data: object
  ) => {
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
export const verifyUserOtp = async (
    data: object
  ) => {
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

  export const loginUser = async (data: object) => {
    console.log("my req", data);
    
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/auth/phone-login`,
      qs.stringify(data),  // Convert object to URL-encoded string
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'  // Set the correct content type
        }
      }
    );
  
    return res;
  };