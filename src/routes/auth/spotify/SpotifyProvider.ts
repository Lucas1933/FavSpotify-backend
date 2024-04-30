import HttpClient from "../../../utils/HttpClient";
import Utils from "../../../utils/Utils";

export default class SpotifyProvider {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private scope: string;
  private state: string;
  private httpClient: HttpClient;
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID as string;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET as string;
    this.redirectUri =
      "http://localhost:3000/favspotify/api/auth/callback/spotify";
    this.scope = "user-read-private user-read-email";
    this.state = "";
    this.httpClient = new HttpClient("https://api.spotify.com/v1");
  }

  public async getAuthorizationUrl(): Promise<string> {
    await this.setState();
    const query = {
      response_type: "code",
      client_id: this.clientId,
      scope: this.scope,
      redirect_uri: this.redirectUri,
      state: this.state,
    };
    const url =
      "https://accounts.spotify.com/authorize?" +
      (await Utils.objectToQueryString(query));

    return url;
  }

  public async getAuthorizationToken(
    code: string
  ): Promise<SpotifyAuthorizationToken> {
    const concatenatedString = `${this.clientId}:${this.clientSecret}`;
    const buffer = Buffer.from(concatenatedString, "utf-8");
    const body = {
      code: code,
      redirect_uri: this.redirectUri,
      grant_type: "authorization_code",
    };
    const headers = {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + buffer.toString("base64"),
    };
    const token: SpotifyAuthorizationToken = await this.httpClient.post(
      "https://accounts.spotify.com/api/token",
      body,
      { headers: headers }
    );
    return token;
  }

  public getState(): string {
    return this.state;
  }

  private async setState(): Promise<void> {
    this.state = await Utils.generateRandomString(16);
  }
}
