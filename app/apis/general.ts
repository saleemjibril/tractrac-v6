import axios from "axios";

export const becomeAgent = async (data: object, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/agent/become-agent`,
      data,
      config
    );
  
    return res;
  };

export const investInTractor = async (data: object, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/investor/invest-tractor`,
      data,
      config
    );
  
    return res;
  };

export const registerAsVendor = async (data: object, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/vendor/tractor-vendor`,
      data,
      config
    );
  
    return res;
  };

export const enlistOperator = async (data: object, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/operator/register-operator`,
      data,
      config
    );
  
    return res;
  };