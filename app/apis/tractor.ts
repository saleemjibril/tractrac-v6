import axios from "axios";

export const createTractor = async (data: object, token: string) => {
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
    } else if (Array.isArray(value)) {
      // Handle arrays - append each item separately or as a single value
      if (key === 'implement_types' || key === 'implement_types') {
        // For implementType, send each value separately
        value.forEach((item) => {
          formData.append(key, String(item));
        });
      } else {
        // For other arrays, you might want to send as JSON string
        formData.append(key, JSON.stringify(value));
      }
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
      // Remove Content-Type header - let the browser set it automatically for FormData
      // This ensures proper boundary is set for multipart/form-data
    },
  };

  // Log FormData entries
  console.log("FormData contents:");
  for (const pair of formData.entries()) {
    console.log(typeof pair[1], pair[0], pair[1]);
  }
  
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/tractors`,
    formData,
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
    `${process.env.NEXT_PUBLIC_URL}/hire_tractor/booked-dates/${tractorId}`,
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

export const filterTractors = async (params: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/tractors/search?${params}`,
    config
  );

  return res;
};