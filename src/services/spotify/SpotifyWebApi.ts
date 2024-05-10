import HttpClient from "@src/services/http-client/HttpClient";

export default class SpotifyWebApi {
  private httpClient: HttpClient;
  constructor() {
    this.httpClient = new HttpClient("https://api.spotify.com/v1");
  }

  public async getItem(token: SpotifyAuthorizationTokens /* query: string */) {
    const headers = {
      Authorization: "Bearer " + token.access_token,
    };
    const items: any = await this.httpClient.get(
      "/search?q=track=Clint+Eastwood&type=track&market=us",
      {
        headers,
      }
    );

    const coincidences = items.tracks.items.map((eachTrack: any) => ({
      album: {
        spotifyUrl: eachTrack.album.external_urls.spotify,
        name: eachTrack.album.name,
        image: eachTrack.album.images[0].url,
        id: eachTrack.album.id,
      },
      song: {
        name: eachTrack.name,
        isplayable: eachTrack.is_playable,
        previewUrl: eachTrack.preview_url,
        id: eachTrack.id,
      },
    }));
    const result = {
      pagination: {
        limit: items.tracks.limit,
        next: items.tracks.next,
        offset: items.tracks.offset,
        previous: items.tracks.previous,
        total: items.tracks.total,
      },
      coincidences,
    };

    return result;
  }

  public async saveTrack() {}

  public async getUserInformation(
    token: SpotifyAuthorizationTokens
  ): Promise<UserInformation> {
    const headers = {
      Authorization: "Bearer " + token.access_token,
    };
    const userInfo = (await this.httpClient.get("/me", {
      headers,
    })) as UserInformation;
    return userInfo;
  }
}
