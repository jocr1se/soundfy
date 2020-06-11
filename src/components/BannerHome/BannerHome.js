import React, { useState, useEffect } from "react";
import firebase from "../../utils/Firebase";

import "firebase/storage";

import "./BannerHome.scss";
export default function BannerHome() {
  const [banner, setBanner] = useState(null);
  useEffect(() => {
      getBannerUrl();
  }, [])  
  const getBannerUrl = () => {
    firebase
      .storage()
      .ref("other/bannerPrincipal.jpg")
      .getDownloadURL()
      .then((res) => {
        setBanner(res)
      });
  };
  if(!banner){
      return null;
  }
  return (
    <div 
        className="banner-home"
        style={{backgroundImage:`url('${banner}')`}}
    />
  );
}
