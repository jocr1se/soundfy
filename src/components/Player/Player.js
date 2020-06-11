import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom"
import ReactPlayer from "react-player";

import "./Player.scss"
import { Progress, Icon, Input } from "semantic-ui-react";

export default function Player(props){
    const {songData,playing, setPlaying} = props;
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [volume, setVolume]= useState(0.3)
    
    useEffect(() => {
        if(songData?.url){
            onStart();
        }
    }, [songData])

    const onStart = ()=>{
        setPlaying(true)
    }
    const onPause = () =>{
        setPlaying(false)
    }
    const onProgress = (data)=>{
        setPlayedSeconds(data.playedSeconds)
        setTotalSeconds(data.loadedSeconds)
    }

    
    return(
        <>
            <div className="player-content">
                <div className="player-left">
                    <img src={songData?.albumImage} alt="" />
                    <div>
                        <h4>{songData?.nameSong}</h4>
                        <Link to={"/artist/"+ songData?.artistId}>
                            <h5>{songData?.nameArtist}</h5>
                        </Link>
                    </div>
                </div>
                <div className="player-center">
                    <div className="controls">
                        {playing?(
                            <Icon onClick={onPause} className="pause circle outline" />
                        ):(
                            <Icon onClick={onStart} className="play circle outline" />
                        )}
                    </div>
                    <Progress 
                        progress="value"
                        value={playedSeconds}
                        total={totalSeconds}
                        size="tiny"
                    />
                </div>
                <div className="player-right">
                    <Input 
                        label={<Icon name="volume up" />}
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        name="volume"
                        onChange={(e,data)=>setVolume(Number(data.value))}
                        volume={volume}
                    />
                </div>
            </div>
            <ReactPlayer 
                className="react-player"
                url={songData?.url}   
                playing={playing}
                height="0"
                width="0"
                volume={volume}
                onProgress={e => onProgress(e)}         
            />
           
        </>
    )
}