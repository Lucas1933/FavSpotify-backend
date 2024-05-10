import HttpClient from "@src/services/http-client/HttpClient";
import objectToQueryString from "@utils/object_to_query_string";
import config from "@src/config";
export default class SpotifyProvider {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private scope: string;
  private stateCode: string;
  private httpClient: HttpClient;
  constructor() {
    this.clientId = config.secret.SPOTIFY_CLIENT_ID as string;
    this.clientSecret = config.secret.SPOTIFY_CLIENT_SECRET as string;
    this.redirectUri =
      "http://localhost:3000/favspotify/api/auth/callback/spotify";
    this.scope = "user-read-private user-read-email";
    this.stateCode = config.secret.SPOTIFY_STATE_CODE as string;
    this.httpClient = new HttpClient("");
  }

  public async getAuthorizationUrl(): Promise<string> {
    const query = {
      response_type: "code",
      client_id: this.clientId,
      scope: this.scope,
      redirect_uri: this.redirectUri,
      state: this.stateCode,
    };
    const url =
      "https://accounts.spotify.com/authorize?" +
      (await objectToQueryString(query));
    return url;
  }

  public async getAuthorizationToken(
    code: string
  ): Promise<SpotifyAuthorizationTokens> {
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
    const token: SpotifyAuthorizationTokens = await this.httpClient.post(
      "https://accounts.spotify.com/api/token",
      body,
      { headers: headers }
    );
    return token;
  }
}
