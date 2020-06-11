import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";

import "./Album.scss";
import { Icon } from "semantic-ui-react";
const db = firebase.firestore(firebase);

function Album(props) {
  const { match, playerSong, playing, setPlaying } = props;
  const id = match.params.id;
  const [album, setAlbum] = useState("");
  const [artist, setArtist] = useState("");
  const [artistId, setArtistId] = useState("");
  const [bannerUrl, setBannerUrl] = useState(null);
  const [listSongs, setListSongs] = useState(null);

  useEffect(() => {
    db.collection("albums")
      .doc(id)
      .get()
      .then((res) => {
        const data = res.data();
        setAlbum(data.name);
        setArtistId(data.artist);
        db.collection("artists")
          .doc(data.artist)
          .get()
          .then((response) => {
            setArtist(response.data().name);
          });
        firebase
          .storage()
          .ref("albums/" + data.banner)
          .getDownloadURL()
          .then((url) => {
            setBannerUrl(url);
          });
      });
  }, [id]);

  useEffect(() => {
    const arraySongs = [];

    db.collection("songs")
      .where("album", "==", id)
      .get()
      .then((res) => {
        const songs = res.docs;
        for (let i = 0; i < songs.length; i++) {
          const data = songs[i].data();
          data.id = songs[i].id;
          arraySongs.push(data);
        }
        setListSongs(arraySongs);
      });
  }, [id]);

  return (
    <div className="album">
      <div className="album__header">
        <div
          style={{ backgroundImage: `url("${bannerUrl}")` }}
          className="avatar"
        />
        <div className="info-album">
          <h3>ÁLBUM</h3>
          <h2>{album}</h2>

          <h4>
            De{" "}
            <Link to={"/artist/" + artistId}>
              <span>{artist}</span>
            </Link>
          </h4>
        </div>
      </div>

      <div className="album__list-song">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th></th>
              <th>Titulo</th>
            </tr>
          </thead>
          <tbody>
            {listSongs?.map((item, index) => {
              return (
                <Song
                  key={item.id}
                  item={item}
                  index={index}
                  bannerUrl={bannerUrl}
                  playerSong={playerSong}
                  artistId={artistId}
                  artist={artist}
                  playing={playing}
                  setPlaying={setPlaying}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default withRouter(Album);

function Song(props) {
  const {
    item,
    index,
    playerSong,
    bannerUrl,
    artist,
    artistId,
    playing,
    setPlaying,
  } = props;
  const [play, setPlay] = useState(false);
  
  /*const onPlay = (e) => {
    playerSong(bannerUrl, item.name, item.song, artist);
    setPlaying(true);
    setPlay(true);
    //setActiveSong(index)
    //setActive(!active)
    
  };*/
  const onPause = () => {
    setPlaying(false);
    setPlay(playing);
  };
  return (
    <tr>
      <td>{index + 1}</td>
      <td>
        {!play ? (
          <Icon
            name="play circle outline"
            onClick={(e) => {
              playerSong(bannerUrl, item.name, item.song, artist, artistId);
              setPlaying(false);
              setPlay(true);

              let elements = document.querySelectorAll(
                "tbody > tr > td:last-child"
              );
              for (let i = 0; i < elements.length; i++) {
                if (elements[i].classList.contains("active")) {
                  elements[i].classList.remove("active");
                }
              }
              let icons = document.querySelectorAll('tbody>tr>td>i');
              for(let j=0;j<icons.length;j++){
                if(icons[j].classList.contains('volume')){
                  icons[j].classList.replace('volume','play');
                  icons[j].classList.replace('up','circle');
                  icons[j].classList.add('outline');
                }
              }
              e.target.parentElement.parentElement.lastChild.classList.add(
                "active"
              );
            }}
          />
        ) : (
          <Icon name="volume up" onClick={onPause} />
        )}
      </td>
      <td className="song-clase">{item.name}</td>
    </tr>
  );
}
