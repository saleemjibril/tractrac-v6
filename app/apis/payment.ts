import axios from "axios";

export const getBanks = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/payments/banks`,
    config
  );

  return res;
};

export const verifyBankAccount = async (
  account_number: string,
  bank_code: string,
  token: string
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/payments/verify-account`,
    {
      account_number,
      bank_code,
    },
    config
  );

  return res;
};

export const getInvoiceDetails = async (invoice_id: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/payments/invoice-details/${invoice_id}`,
    config
  );

  return res;
};

export const verifyPayment = async (reference: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/payments/verify/${reference}`,
    config
  );

  return res;
};

export const initialisePayment = async (
  hire_tractor_id: string,
  invoice_number: string,
  amount: number,
  token: string
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  console.log( {
    hire_tractor_id,
    invoice_number,
    amount,
    payment_type: "card",
  });
  

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/payments/initialize`,
    {
      hire_tractor_id,
      invoice_number,
      amount,
      payment_type: "card",
    },
    config
  );

  return res;
};
