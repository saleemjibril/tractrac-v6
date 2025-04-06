type TransformRequest = (details: Record<string, any>) => string;

export const transformRequest: TransformRequest = (details: Record<string, any>) =>
  Object.keys(details)
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(details[key])
    )
    .join("&");