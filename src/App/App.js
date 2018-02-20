import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../PlayList/PlayList';
import Spotify from '../util/Spotify/Spotify'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playListName: "myPlaylist",
      searchResults: [],
      playListTracks: [],
    };
  this.addTrack = this.addTrack.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.updatePlayListName = this.updatePlayListName.bind(this);
  this.savePlayList = this.savePlayList.bind(this);
  this.search = this.search.bind(this);
  }

  addTrack(track) {
    let currentPlayList = this.state.playListTracks.filter(checkTrack => checkTrack.id !== track.id);
    let newPlayList = currentPlayList.concat(track);
    this.setState({ playListTracks: newPlayList });
  }

  removeTrack(track) {
    let currentPlayList = this.state.playListTracks;
    this.setState({ playListTracks: currentPlayList.filter(checkTrack => checkTrack.id !== track.id) });
  }

  updatePlayListName(name) {
    this.setState({ playListName: name});
  }

  savePlayList() {
    let trackUris = this.state.playListTracks.map(track => track.uri);
    Spotify.savePlayList(this.state.playListName, trackUris);
    this.setState({ playListTracks: [], playListName: 'New PlayList'});
  }

  search(term) {
    Spotify.search(term).then(results => Array.from(results)).then(trackArray => {this.setState({ searchResults: trackArray })});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
              onRemove={this.removeTrack}
            />
            <PlayList
              playListName={this.state.playListName}
              playListTracks={this.state.playListTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlayListName}
              onAdd={this.addTrack}
              onSave={this.savePlayList}
            />
          </div>
        </div>
      </div>
    );
  }
}


export default App;
