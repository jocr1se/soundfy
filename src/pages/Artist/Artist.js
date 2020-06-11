import React, { useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import BannerArtist from "../../components/Artist/BannerArtist";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";

import "./Artist.scss";

const db = firebase.firestore(firebase);

function Artist(props) {
  const { match } = props;
  const [bannerUrl, setBannerUrl] = useState(null);
  const [artistName, setArtistName] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const id = match.params.id;

    db.collection("artists")
      .doc(id)
      .get()
      .then((res) => {
        setArtistName(res.data().name);
        const bannerId = res.data().banner;
        firebase
          .storage()
          .ref("artists/" + bannerId)
          .getDownloadURL()
          .then((url) => {
            setBannerUrl(url);
          });
      });
  }, [match.params.id]);
  useEffect(() => {
    const id = match.params.id;
    const arrayAlbum = [];

    db.collection("albums")
      .where("artist", "==", id)
      .get()
      .then((response) => {
        const albums = response.docs;
        for (let i = 0; i < albums.length; i++) {
          const data = albums[i].data();
          data.id = albums[i].id;
          arrayAlbum.push(data);
        }
        setAlbums(arrayAlbum);
      });
  }, [match.params.id]);
  if (albums.length < 5) {
    return (
      <div className="artist">
        <BannerArtist bannerUrl={bannerUrl} artistName={artistName} />
        <div className="albums">
          {albums?.map((item) => {
            return <Album item={item} />;
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="artist">
        <BannerArtist bannerUrl={bannerUrl} artistName={artistName} />
        <div className="artist__content">
          <BasicSliderItems
            title="Albumes"
            data={albums}
            folderImage="albums"
            urlName="album"
          />
        </div>
      </div>
    );
  }
}
export default withRouter(Artist);

function Album(props) {
  const { item } = props;
  const [banner, setBanner] = useState(null);
  console.log(banner);

  useEffect(() => {
    firebase
      .storage()
      .ref("albums/" + item.banner)
      .getDownloadURL()
      .then((url) => {
        setBanner(url);
      });
  }, [item]);
  return (
    <Link to={"/album/"+item.id}>
      <div className="albums__item">
        <div 
          style={{backgroundImage: `url('${banner}')`}}
          className="avatar"
        />
        <h4>{item.name}</h4>
      </div>
    </Link>
  );
}
