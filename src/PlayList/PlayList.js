import React from 'react';
import './PlayList.css';
import  TrackList  from '../TrackList/TrackList';

class PlayList extends React.Component {
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleNameChange(event) {
    this.props.onNameChange(event.target.value);
  }

  render() {
    return (
      <div className="Playlist">
        <input
          value={this.props.playListName}
          onChange={this.handleNameChange}
        />
        <TrackList
          tracks={this.props.playListTracks}
          onRemove={this.props.onRemove}
          onAdd={this.props.onAdd}
          isRemoval={true}
        />
        <a
          className="Playlist-save"
          onClick={this.props.onSave}
        >SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default PlayList;
