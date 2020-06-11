import React from 'react';
import { Switch, Route } from "react-router-dom";

//pages
import Home from "../pages/home";
import Settings from "../pages/Settings";
import Artist from "../pages/Artist";
import Artists from "../pages/Artists";
import Albums from "../pages/albums";
import Album from "../pages/album";

export default function Routes(props){
    const { user, setReloadApp, playerSong,playing,setPlaying} = props;
    
    return(
        <Switch>
            <Route path="/" exact>
                <Home playerSong={playerSong} />
            </Route>
            <Route path="/artists" exact>
                <Artists />
            </Route>
            <Route path="/artist/:id" exact>
                <Artist />
            </Route>
            <Route path="/albums" exact>
                <Albums />
            </Route>
            <Route path="/album/:id" exact>
                <Album playerSong={playerSong} playing={playing} setPlaying={setPlaying} />
            </Route>
            <Route path="/settings" exact>
                <Settings user={user} setReloadApp={setReloadApp} />
            </Route>
        </Switch>
    )
}