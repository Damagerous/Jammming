import React from 'react';

let accessToken;
let expiresIn;
let clientId = "7334db470690437c88299115ece2dff1";
let redirectUri = "http://localhost:3000/";

const apiUrl = "https://api.spotify.com";


export const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else {
      let urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
      let urlExpirationTime = window.location.href.match(/expires_in=([^&]*)/);
      if (urlAccessToken && urlExpirationTime) {
        accessToken = urlAccessToken[1];
        expiresIn = urlExpirationTime[1];
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
      } else {
        const redirectUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
        window.location = redirectUrl;
      }
    }
  },

  search(term) {
    if (!accessToken) { this.getAccessToken(); }
    const searchUrl = `${apiUrl}/v1/search?type=track&q=${term}`;
    return fetch(searchUrl).then(response => response.json()).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      } else {
        return jsonResponse.tracks.item.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }))
      }
    })
  },

  savePlayList(playListName, playListTracks) {
    if (!playListName || !playListTracks) {
      return;
    } else {
      const userUrl = `${apiUrl}/v1/me`;
      const headers = {
        Authorization: 'Bearer ' + accessToken
      };
      let userId;
      return fetch(userUrl, headers).then(response => response.json()).then(jsonResponse => {
        userId = jsonResponse.id;
        const userPlayListUrl = `${apiUrl}/v1/users/${userId}/playlists`;
        let body = { name: playListName};
        let createPlayListPost = { headers: headers, method: 'POST', body: JSON.stringify(body) };
        return fetch(userPlayListUrl, createPlayListPost).then(response => response.json()).then(jsonResponse => jsonResponse.id).then(playListId => {
          const addPlayListTracksUrl = `${userPlayListUrl}/${playListId}/tracks`;
          let addPlayListPost = { headers: headers, method: 'POST', body: JSON.stringify({ uris: playListTracks})}
          fetch(addPlayListTracksUrl, addPlayListPost)
        })
      })
    }
  }
}

export default Spotify;
