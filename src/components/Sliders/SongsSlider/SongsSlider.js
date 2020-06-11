import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";

import "./SongsSlider.scss";

const db = firebase.firestore(firebase);

export default function SongsSlider(props) {
  const { title, data, playerSong } = props;
    
  const settings = {
    dots: false,
    infiniti: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    centerMode: true,
    className: "songs-slider__list",
  };

  if (data.length < 5) {
    return null;
  }
  return (
    <div className="songs-slider">
      <h2>{title}</h2>
      <Slider {...settings}>
        {data.map((item) => {
          return <Song key={item.id} item={item} playerSong={playerSong} />;
        })}
      </Slider>
    </div>
  );
}
function Song(props) {
  const { item, playerSong } = props;
  const [banner, setBanner] = useState(null);
  const [album, setAlbum] = useState(null);
  const [artistName, setArtistName] = useState(null);

  const onPlay = () => {
    playerSong(banner, item.name, item.song, artistName, album.artist);
  };

  useEffect(() => {
    db.collection("albums")
      .doc(item.album)
      .get()
      .then((res) => {
        const data = res.data();
        data.id = res.id;
        setAlbum(data);
        db.collection("artists")
          .doc(data.artist)
          .get()
          .then((res) => {
            const dataArtist = res.data();
            setArtistName(dataArtist.name);
          });
        firebase
          .storage()
          .ref("albums/" + data.banner)
          .getDownloadURL()
          .then((url) => {
            setBanner(url);
          });
      });
  }, [item]);

  return (
    <div className="songs-slider__list-song">
      <div
        className="avatar"
        style={{ backgroundImage: `url('${banner}')` }}
        onClick={onPlay}
      >
        <Icon name="play circle outline" />
      </div>
      <Link to={"/album/" + album?.id}>
        <h4>{item?.name}</h4>
      </Link>
    </div>
  );
}
