import axios from "axios";


export const getUserStats = async (id: string, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/user_stats/user/${id}/stats`,
      config
    );
  
    return res;
  };