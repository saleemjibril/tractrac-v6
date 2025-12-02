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
      if (key === 'implement_types') {
        // Follow mobile app: send as a single comma-separated string
        const joined = value.map((v) => String(v).toLowerCase()).join(',');
        formData.append(key, joined);
      } else if (key === 'tractor_image_files') {
        // For tractor_image_files, append each file separately
        value.forEach((file: File) => {
          formData.append(key, file);
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
  formData.forEach((value, key) => {
    console.log(typeof value, key, value);
  });
  
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


export const getTractor = async (id: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/tractors/${id}`,
    config
  );

  return res;
};

export const getApprovedTractors = async (coords: any, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/tractors/approved-for-hire?skip=0&limit=100&user_lat=${coords?.latitude}&user_lng=${coords?.longitude}`,
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
export const hireTractorWithoutFarmSize = async (data: object, token: string) => {

  console.log("hireTractor request", data);
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/hire_tractor/hire-without-farm-size`,
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
    `${process.env.NEXT_PUBLIC_URL}/tractors/my-tractors?status=verified`,
    config
  );

  return res;
};

export const getMyTractorsPendingReview = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/tractors/my-tractors/pending-review`,
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

export const getMyHiredTractorsDetails = async (hire_tractor_id: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/hire_tractor/hire/${hire_tractor_id}`,
    config
  );

  return res;
};

export const getAllHiringActivities = async (user_id: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/user_stats/user/${user_id}/all-hiring-activities`,
    config
  );

  return res;
};

export const cancelBooking = async (hire_tractor_id: string, reason: string, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_URL}/hire_tractor/hire/${hire_tractor_id}/cancel?reason=${reason}`,
    {},
    config
  );

  return res;
};

export const getUserPendingHireRequests = async (token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/hire_tractor/hire?status=pending`,
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