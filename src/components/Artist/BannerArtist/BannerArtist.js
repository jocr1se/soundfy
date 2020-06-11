import React from "react";

import "./BannerArtist.scss"

export default function BannerArtist(props){
    const { bannerUrl, artistName } = props;
    return(
        <div
            style={{backgroundImage: `url('${bannerUrl}')`}}
            className="banner-artist"
        >   
            <div 
                className="banner-artist__gradient"
            />
            <div className="banner-artist__info">
                <h4>ARTISTA</h4>
                <h1>{artistName}</h1>
            </div>
        </div>
            
    )
}