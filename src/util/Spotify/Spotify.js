let accessToken;
let expiresIn;
let clientId = "7334db470690437c88299115ece2dff1";
let redirectUri = "http://localhost:3000/";

const apiUrl = "https://api.spotify.com/v1";


export const Spotify =
{
  getAccessToken()
  {
    if(accessToken)
      return accessToken;
    else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/))
    {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];

      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');

      return accessToken;
    }
    else
    {
      let url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = url;
    }
  },

  search(term)
  {
    const searchURL = `${apiUrl}/search?type=track&q=${term}&limit=12`;
    return fetch(searchURL, {headers: {Authorization: `Bearer ${this.getAccessToken()}`}})
      .then(response => response.json())
        .then(jsonResponse =>
          {
            if(jsonResponse.tracks)
            {
              return jsonResponse.tracks.items.map(track =>
                {
                  return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                  };
                }
              );
            }
            else
              return [];
          }
        );
  },

  savePlayList(playListName, playListTracks)
  {
    if (!playListName || !playListTracks) {
      return;
    } else {
      let userId;
      let url = `${apiUrl}/me`;
      let postObj;
      return fetch(url, {headers: {Authorization: `Bearer ${this.getAccessToken()}`}})
              .then(response => response.json())
                .then(jsonResponse => {
                  userId = jsonResponse.id;
                  url = `${apiUrl}/users/${userId}/playlists`;
                  postObj = {headers: {Authorization: `Bearer ${this.getAccessToken()}`}, method: 'POST', body: JSON.stringify({ name: playListName}) };
                  return fetch(url, postObj)
                    .then(response => response.json())
                      .then(jsonResponse => jsonResponse.id)
                        .then(playListId => {
                          url = `${apiUrl}/users/${userId}/playlists/${playListId}/tracks`;
                          postObj = {headers: {Authorization: `Bearer ${this.getAccessToken()}`}, method: 'POST', body: JSON.stringify({ uris: playListTracks}) };
                          fetch(url, postObj);
                        })
                })
    }
  }
}

export default Spotify;
