export default abstract class Utils {
  public static generateRandomString(length: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let randomString = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset[randomIndex];
      }
      resolve(randomString);
    });
  }

  public static objectToQueryString(obj: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const queryFromObject = Object.keys(obj)
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
        )
        .join("&");

      resolve(queryFromObject);
    });
  }
}
