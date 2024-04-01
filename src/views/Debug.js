import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Debug() {
    const navigate = useNavigate();

    return <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button onClick={() => {
            navigate("/game/new/map1");
        }}>New Game (map1)</button>
        <button onClick={() => {
            navigate("/game/new/humble_beginnings");
        }}>New Game (humble beginnings)</button>
        <button onClick={() => {
            navigate("/game/load/test");
        }}>Load Game (test)</button>
        <button onClick={() => {
            navigate("/editor/module/main");
        }}>Module editor (main)</button>
        <button onClick={() => {
            navigate("/editor/map/map1");
        }}>Map Editor (map1)</button>
        <button onClick={() => {
            navigate("/editor/map/humble_beginnings");
        }}>Map Editor (humble beginnings)</button>
        <button onClick={() => {
            navigate("/campaign/a_heros_journey");
        }}>Campaign (a hero's journey)</button>
    </div>
}