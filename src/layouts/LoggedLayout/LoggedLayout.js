import React, { useState } from "react";
import "./LoggedLayout.scss";
import { BrowserRouter } from "react-router-dom";
import Routes from "../../routes/Routes";
import MenuLeft from "../../components/MenuLeft";
import TopBar from "../../components/TopBar";
import Player from "../../components/Player";
import firebase from "../../utils/Firebase";
import "firebase/storage";

export default function LoggedLayout(props) {
  const { user, setReloadApp } = props;
  const [songData, setSongData] = useState(null);
  const [playing, setPlaying] = useState(true);

  const playerSong = (albumImg, songName, fileSong, nameArtist, artistId) => {
    firebase
      .storage()
      .ref("songs/" + fileSong)
      .getDownloadURL()
      .then((url) => {
        setSongData({
          url: url,
          albumImage: albumImg,
          nameSong: songName,
          nameArtist: nameArtist,
          artistId : artistId
        });
      });
  };

  return (
    <BrowserRouter>
      <div className="logged-layout">
        <div className="menu-left">
          <MenuLeft user={user} />
        </div>
        <div className="top-bar-box">
          <TopBar user={user} />
        </div>
        <div className="content">
          <Routes
            user={user}
            setReloadApp={setReloadApp}
            playerSong={playerSong}
            setPlaying={setPlaying}
          />
        </div>
        <div className="player">
          <Player
            songData={songData}
            playing={playing}
            setPlaying={setPlaying}
          />
        </div>
      </div>
    </BrowserRouter>
  );
}
