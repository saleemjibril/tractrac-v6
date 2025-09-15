import axios from "axios";

export const createFarmMeasurement = async (coordinates, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/farm/measurements`,
    { coordinates, farm_name: "My farm" },
    config
  );

  return res;
};
