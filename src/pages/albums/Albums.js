import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom"
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";
import "./Albums.scss";

const db = firebase.firestore(firebase);
export default function Albums() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    db.collection("albums")
      .get()
      .then((response) => {
        const albums = response.docs;
        const arrayAlbums = [];

        for (let i = 0; i < albums.length; i++) {
          const data = albums[i].data();
          data.id = albums[i].id;
          arrayAlbums.push(data);
        }
        setAlbums(arrayAlbums);
      });
  }, []);

  return (
    <div className="box-albums">
      <h1>Albums</h1>
      <div className="albums">
        {albums.map((item) => (
          <div className="albums__item">
            <Album item={item}/>
          </div>
        ))}
      </div>
    </div>
  );
}
function Album(props) {
  const { item } = props;
  const [banner, setBanner] = useState(null);
  
  useEffect(() => {
    firebase
      .storage()
      .ref("albums/" + item.banner)
      .getDownloadURL()
      .then((response) => {
        setBanner(response);
      });
  }, [item]);

  return(
    <Link to={"album/"+item.id} >
      <>
        <div
          style={{backgroundImage : `url('${banner}')`}}
          className="avatar"
        />
        <h4>{item.name}</h4>
      </>
    </Link >
  )
}
