import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import firebase from "../../../utils/Firebase";
import "firebase/storage";

import "./BasicSliderItems.scss";

export default function BasicSliderItems(props) {
  const { title, data, folderImage, urlName } = props;
    
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: true,
    className: "basic-slider-items__list",
  };

  return (
    <div className="basic-slider-items">
      <h2>{title}</h2>
      <Slider {...settings}>
        {data.map((item) => {
          return (
            <RenderItem
              item={item}
              folderImage={folderImage}
              urlName={urlName}
              key={item.id}
            />
          );
        })}
      </Slider>
    </div>
  );
}

function RenderItem(props) {
  const { item, folderImage, urlName } = props;
  const [imageUrl, setImageUrl] = useState(null);
  
  useEffect(() => {
    firebase
      .storage()
      .ref(folderImage + "/" + item.banner)
      .getDownloadURL()
      .then((url) => {
        
        setImageUrl(url);
      });
  }, [item, folderImage]);
  
  return (
    <Link to={"/"+urlName+"/" + item.id}>
      <div className="basic-slider-items__list-item">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        <h2>{item.name}</h2>
      </div>
    </Link>
  );
}
