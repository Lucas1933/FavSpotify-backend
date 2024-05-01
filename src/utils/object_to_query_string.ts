export default function objectToQueryString(obj: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const queryFromObject = Object.keys(obj)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
      )
      .join("&");

    resolve(queryFromObject);
  });
}