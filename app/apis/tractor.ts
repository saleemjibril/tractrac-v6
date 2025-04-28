import axios from "axios";

export const createTractor = async (data: object, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/tractors`,
    data,
    config
  );

  return res;
};

export const getTractors = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/tractors`,
    config
  );

  return res;
};
export const getApprovedTractors = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/tractors/approved-for-hire?skip=0&limit=100`,
    config
  );

  return res;
};

export const getBookedDates = async (tractorId: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/hire_tractor/booked-dates/faae57e6-8c31-4a78-8faa-4cdb8a1f47e4`,
    config
  );

  return res;
};

export const hireTractor = async (data: object, token: string) => {

  console.log("hireTractor request", data);
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/hire_tractor/hire`,
    data,
    config
  );

  return res;
};


export const getMyTractors = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/tractors/my-tractors`,
    config
  );

  return res;
};

export const getMyHiredTractors = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/hire_tractor/hire`,
    config
  );

  return res;
};