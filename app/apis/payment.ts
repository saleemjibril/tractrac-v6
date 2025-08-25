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

  console.log({
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

export const initialiseTrackerPayment = async (
  tractor_id: string,
  invoice_number: string,
  amount: number,
  token: string
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  console.log({
    tractor_id,
    invoice_number,
    amount,
    payment_type: "card",
  });

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/payments/tracker/initialize`,
    {
      tractor_id,
      invoice_number,
      amount,
      payment_type: "card",
    },
    config
  );

  return res;
};

export const getTrackerInvoiceDetails = async (tractor_id: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/payments/tracker/${tractor_id}/invoice`,
    config
  );

  return res;
  
};

export const verifyTrackerPayment = async (tractor_id: string, reference: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/v1/tractors/${tractor_id}/confirm-payment?payment_reference=${reference}`,
    config
  );

  return res;
};

export const getUserPayments = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/payments/user`,

    config
  );

  return res;
};

export const getUserAgroToolPayments = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/hire_addon_payment/user`,

    config
  );

  return res;
};


export const getAgroToolInvoiceDetails = async (invoice_id: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/hire_addon_payment/invoice-details/${invoice_id}`,
    config
  );

  return res;
  
};

export const initialiseAgroToolPayment = async (
  hire_addon_id: string,
  invoice_number: string,
  amount: number,
  token: string
) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  console.log({
    hire_addon_id,
    invoice_number,
    amount,
    payment_type: "card",
  });

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/hire_addon_payment/initialize`,
    {
      hire_addon_id,
      invoice_number,
      amount,
      payment_type: "card",
    },
    config
  );

  return res;
};


export const verifyAgroToolPayment = async (reference: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/hire_addon_payment/verify/${reference}`,
    config
  );

  return res;
};
