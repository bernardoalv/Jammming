const clientId = '877858f20eba4aaa89a7f379c79376c2';
const redirectURI = 'http://localhost:3000/';
const spotifyURIBase = 'https://api.spotify.com/v1/';
const accessURIBase = 'https://accounts.spotify.com/authorize';


let accessToken;

const Spotify = {

  // Spotify API access token
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
        const accessURI = `${accessURIBase}?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        window.location = accessURI;
    }

  },

/* method that accepts a search term input, passes the search term value to a
Spotify request, then return the response as a list of tracks in JSON format */
  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`${spotifyURIBase}search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  ).then(response => { return response.json(); }
  ).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        length: track.duration_ms,
        image: track.album.images[2],
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });


  },

// writes user's custom playlist in Jammming to their Spotify account
  savePlayList(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    let userId;
    return fetch(`${spotifyURIBase}me`, {headers: headers}).then(response => response.json()).then(jsonResponse => {
      userId = jsonResponse.id;
        return fetch(`${spotifyURIBase}users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: name})
        }).then(response => response.json()).then(jsonResponse => {
            const playListId = jsonResponse.id;
            return fetch(`${spotifyURIBase}users/${userId}/playlists/${playListId}/tracks`, {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({uris: trackUris})
          });
        });
      });
    }

};

export default Spotify;
