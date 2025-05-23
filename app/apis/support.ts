import axios from "axios";

export const createSupportTicket = async (data: object, token: string) => {

  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/support/tickets`,
    data,
    config
  );

  return res;
};

export const getUserSupportTickets = async (token: string) => {

  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/support/tickets`,
    config
  );

  return res;
};

export const getUserSupportTicketDetails = async (id: string, token: string) => {

  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/support/tickets/${id}`,
    config
  );

  return res;
};


export const sendSupportTicketMessage = async (id: string, data: object, token: string) => {

  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/support/tickets/${id}/messages`,
    data,
    config
  );

  return res;
};
