import React, { useState, useEffect } from "react";
import BannerHome from "../../components/BannerHome";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";
import SongsSlider from "../../components/Sliders/SongsSlider";
import firebase from "../../utils/Firebase";
import "firebase/firestore";

import "./Home.scss";

const db = firebase.firestore(firebase);

export default function Home(props) {
  const {playerSong} = props;
  const [artist, setArtist] = useState([]);
  const [album, setAlbum] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    db.collection("artists")
      .get()
      .then((response) => {
        const arrayArtists = [];
        const artists = response.docs;
        for (let i = 0; i < artists.length; i++) {
          const data = artists[i].data();
          data.id = artists[i].id;
          arrayArtists.push(data);
        }
        setArtist(arrayArtists);
      });
  }, []);
  useEffect(() => {
    db.collection("albums")
      .get()
      .then((response) => {
        const arrayAlbums = [];

        const albums = response.docs;
        for (let i = 0; i < albums.length; i++) {
          const data = albums[i].data();
          data.id = albums[i].id;
          arrayAlbums.push(data);
        }
        setAlbum(arrayAlbums);
      });
  }, []);
  useEffect(() => {
    db.collection("songs")
      .limit(10)
      .get()
      .then((res) => {
        const arraySongs = [];
        for (let i = 0; i < res.docs.length; i++) {
          const data = res.docs[i].data();
          data.id = res.docs[i].id;
          arraySongs.push(data);
        }
        setSongs(arraySongs);
      });
  }, []);
  return (
    <>
      <BannerHome />
      <div className="home">
        <BasicSliderItems
          title="Nuevos Artistas"
          data={artist}
          folderImage={"artists"}
          urlName={"artist"}
        />
        <BasicSliderItems
          title="Nuevos Albumes"
          data={album}
          folderImage={"albums"}
          urlName={"album"}
        />
        <SongsSlider
          title="Nuevas canciones"
          data={songs}
          playerSong={playerSong}
        />
      </div>
    </>
  );
}
