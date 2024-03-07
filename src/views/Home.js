import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => {
            navigate("/game/new/map1");
        }}>Game (map1)</button>
        <button onClick={() => {
            navigate("/game/new/humbe_beginnings");
        }}>Game (humble beginnings)</button>
        <button>Module editor (main)</button>
        <button onClick={() => {
            navigate("/editor/map/map1");
        }}>Map Editor (map1)</button>
        <button onClick={() => {
            navigate("/editor/map/humble_beginnings");
        }}>Map Editor (humble beginnings)</button>
    </div>
}