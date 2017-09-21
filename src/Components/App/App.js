// Importing components and stylesheets
import React from 'react';
import './App.css';
import {Playlist} from '../Playlist/Playlist.js';
import {SearchBar} from '../SearchBar/SearchBar.js';
import {SearchResults} from '../SearchResults/SearchResults.js';
import Spotify from '../../util/Spotify.js';

export class App extends React.Component {
// declares the App state variables
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: []
    };

    // bindings for the this states
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  // addTrack() adds a song to the playlist state
    addTrack(track) {
      let playlistTracks = this.state.playlistTracks;
      if (!playlistTracks.includes(track)) {
        playlistTracks.push(track);
        this.setState({playlistTracks: playlistTracks});
      }
    }

  // removeTrack() removes a song from a user's playlist
    removeTrack(track) {
      let playlistTracks = this.state.playlistTracks;
      playlistTracks = playlistTracks.filter(currentTrack => currentTrack.id !== track.id);
      this.setState({playlistTracks: playlistTracks});
    }

  // updatePlaylistName() allows to change the name of the playlist
    updatePlaylistName(name) {
      this.setState({playlistName: name});
    }

    // savePlaylist() saves user's playlist to thier Spotify account
      savePlaylist() {
        const trackURIs = this.state.playlistTracks.map(track => {return track.uri});
        Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
          this.setState({
            playlistName: 'New Playlist',
            playlistTracks: [],
            searchResults: []
           });
        });
      }

      // search() updates the searchResults paramenter in App
        search(term) {
          Spotify.search(term).then(searchResults => {
          this.setState({searchResults: searchResults});
        });

        }

        render() {
          return (
            <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
              />
          </div>
        </div>
      </div>
          );
        }
   }
