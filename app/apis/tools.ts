import axios from "axios";

export const createTool = async (data: object, token: string) => {
  console.log("request", data);
  
  // Create a FormData object
  const formData = new FormData();
  
  // Add all properties from data object to the FormData
  Object.entries(data).forEach(([key, value]) => {
    // Handle file objects specially if present
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value instanceof Blob) {
      formData.append(key, value);
    } else if (typeof value === 'object' && value !== null) {
      // Convert objects to JSON strings
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });
  
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Set the Content-Type header for form data
    },
  };

  // Log FormData entries
  console.log("FormData contents:");
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }
  
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/addons`,
    formData, // Send formData instead of JSON
    config
  );

  return res;
};


export const getTools = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/addons`,
    config
  );

  return res;
};

export const getApprovedTools = async (token: string, skip: number = 0, limit: number = 100) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/addons/approved-for-hire?skip=${skip}&limit=${limit}`,
    config
  );

  return res;
};


export const filterTools = async (params: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/addons/search?${params}`,
    config
  );

  return res;
};

export const getToolBookedDates = async (toolId: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/hire_addons/booked-dates/${toolId}`,
    config
  );

  return res;
};

export const hireTool = async (data: object, token: string) => {

  console.log("hireTool request", data);
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/hire_addons`,
    data,
    config
  );

  return res;
};

export const getMyHiredTools = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/hire_addons`,
    config
  );

  return res;
};