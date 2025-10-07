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

export const getUserInfo = async (id: string, token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/users/${id}`,
      config
    );
  
    return res;
  };

export const updateUserInfo = async (id: string, data: object, token: string) => {

  
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_URL}/users/${id}`,
      data,
      config
    );
  
    return res;
  };

  export const getGroups = async (token: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/groups/groups`,
      config
    );
  
    return res;
  };


export const getGroupsMembers = async (group_id: string, token: string) => {
  console.log("requuest id", group_id);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/groups/groups/${group_id}/members`,
    config
  );

  return res;
};

