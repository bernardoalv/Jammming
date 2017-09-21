import React from 'react';
import './TrackList.css';
import {Track} from '../Track/Track.js';

export class TrackList extends React.Component {
  render() {
    return (
      <div className="TrackList">
      {
        this.props.tracks.map(track => {
          return <Track
            onAdd={this.props.onAdd}
            onRemove={this.props.onRemove}
            key={track.id}
            name={this.props.track.name}
            artist={this.props.track.artist}
            album={this.props.track.album}
          />
        })
      }
      </div>
    );
  }
}
