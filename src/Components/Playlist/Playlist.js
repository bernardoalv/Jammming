import React from 'react';
import './Playlist.css';
import {TrackList} from '../TrackList/TrackList.js';

export class Playlist extends React.Component {
  constructor(props) {
    super(props);

    //bindings
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }
  render() {
    return (
      <div className="Playlist">
        <input defaultValue={'New Playlist'} onChange={this.handleNameChange}/>
        <TrackList
          tracks={this.props.playlistTracks}
          onRemove={this.props.onRemove} />
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}
