export const formatMeasurement = (value: number): string => {
  if (value < 1) {
    return value.toFixed(3);
  } else if (value < 10) {
    return value.toFixed(2);
  } else if (value < 100) {
    return value.toFixed(1);
  } else {
    return value.toFixed(0);
  }
};

export const validateGPSAccuracy = (accuracy: number): {
  isGood: boolean;
  message: string;
  color: string;
} => {
  if (accuracy <= 5) {
    return {
      isGood: true,
      message: `GPS: Excellent (${accuracy.toFixed(1)}m)`,
      color: 'text-green-600'
    };
  } else if (accuracy <= 10) {
    return {
      isGood: true,
      message: `GPS: Good (${accuracy.toFixed(1)}m)`,
      color: 'text-yellow-600'
    };
  } else if (accuracy <= 20) {
    return {
      isGood: false,
      message: `GPS: Fair (${accuracy.toFixed(1)}m)`,
      color: 'text-orange-600'
    };
  } else {
    return {
      isGood: false,
      message: `GPS: Poor (${accuracy.toFixed(1)}m)`,
      color: 'text-red-600'
    };
  }
};