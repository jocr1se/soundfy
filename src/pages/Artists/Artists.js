import React, { useState, useEffect } from "react";
import firebase from "../../utils/Firebase";
import { Link } from "react-router-dom";
import "firebase/firestore";
import "firebase/storage";

import "./Artists.scss";

const db = firebase.firestore(firebase);

export default function Artists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    db.collection("artists")
      .get()
      .then((response) => {
        const arrayArtist = [];
        for (let i = 0; i < response.docs.length; i++) {
          const data = response?.docs[i].data();
          data.id = response.docs[i].id;
          arrayArtist.push(data);
        }
        setArtists(arrayArtist);
      });
  }, []);

  return (
    <div className="box-artists">
      <h1>Artistas</h1>
      <div className="artists">
        {artists.map((artist) => (
          <Artist artist={artist} />
        ))}
      </div>
    </div>
  );
}

function Artist(props) {
  const { artist } = props;
  const [bannerUrl, setBannerUrl] = useState(null);
  

  useEffect(() => {
    firebase
      .storage()
      .ref("artists/" + artist.banner)
      .getDownloadURL()
      .then((res) => {
        setBannerUrl(res);
      });
  }, [artist]);

  return (
    <Link to={"artist/" + artist.id}>
      <div className="artists__item">
        <div
          style={{ backgroundImage: `url('${bannerUrl}')` }}
          className="avatar"
        />
        <h4>{artist.name}</h4>
      </div>
    </Link>
  );
}
