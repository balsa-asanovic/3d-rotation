import React, { useEffect, useReducer } from 'react';
import './App.css';
import Object from './components/Object/Object';
import { cubeVertices, cubeIndices } from './components/Object/ObjectData/cubeData';
import { sphereVertices, sphereIndices } from './components/Object/ObjectData/sphereData';
import { cylinderVertices, cylinderIndices } from './components/Object/ObjectData/cylinderData';
import { io } from 'socket.io-client';

type State = {
    randomValue: number;
    randomizerType: string;
    frequency: number;
    disabled: boolean;
};

type Action =
    | { type: 'SET_RANDOM_VALUE'; value: number }
    | { type: 'SET_RANDOMIZER_TYPE'; value: string }
    | { type: 'SET_FREQUENCY'; value: number }
    | { type: 'TOGGLE_DISABLED' };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_RANDOM_VALUE':
            return { ...state, randomValue: action.value };
        case 'SET_RANDOMIZER_TYPE':
            return { ...state, randomizerType: action.value };
        case 'SET_FREQUENCY':
            return { ...state, frequency: action.value };
        case 'TOGGLE_DISABLED':
            return { ...state, disabled: !state.disabled };
        default:
            return state;
    }
}


function App() {
    const [state, dispatch] = useReducer(reducer, {
        randomValue: 1,
        randomizerType: "Local",
        frequency: 100,
        disabled: true,
    });


    useEffect(() => {
        if (state.randomizerType === "Local") {
            const intervalId = setInterval(() => {
                if(!state.disabled)
                    dispatch({ type: 'SET_RANDOM_VALUE', value: Math.random() * 2 + 0.1 });
            }, state.frequency);

            return () => {
                clearInterval(intervalId);
            }
        } else {
            const socket = io("https://randomizer-v7no.onrender.com");
            socket.emit("frequency", state.frequency);
            state.disabled && socket.emit("stop");
            socket.on("message", (data) => {
                if (!state.disabled)
                    dispatch({ type: 'SET_RANDOM_VALUE', value: Number(data) });
            })

            return () => {
                socket.off("message");
            }
        };
    }, [state.frequency, state.disabled, state.randomizerType]);

    return (
        <div className="App">
            <br />
            Frequency adjuster: <br />
            <input
                type="range"
                min={50}
                max={5000}
                value={state.frequency}
                onChange={(e) => dispatch({ type: 'SET_FREQUENCY', value: Number(e.target.value) })}
                disabled={state.disabled} />
            <br />
            <label htmlFor="disable-randomizer">Disable randomizer:</label>
            <input type="checkbox" id="disable-randomizer" onChange={() => dispatch({ type: 'TOGGLE_DISABLED' })} checked={state.disabled} />
            <br />
            <div style={{ textAlign: "left", display: "inline-block", marginTop: "10px" }}>
                Randomizer type: <br />
                <input type="radio"
                    id="local"
                    name="randomizer"
                    value="Local"
                    onChange={(e) => dispatch({ type: "SET_RANDOMIZER_TYPE", value: e.target.value })}
                    checked={state.randomizerType === "Local"}
                />
                <label htmlFor="local">Local</label><br />
                <input type="radio"
                    id="remote"
                    name="randomizer"
                    value="Remote"
                    onChange={(e) => dispatch({ type: "SET_RANDOMIZER_TYPE", value: e.target.value })}
                    checked={state.randomizerType === "Remote"}
                />
                <label htmlFor="remote">Remote</label>
            </div>
            <br />
            <br />
            <div>
                <Object size={state.randomValue} vertices={cubeVertices} indices={cubeIndices} name={"Cube"} />
                <br />
                <Object size={state.randomValue} vertices={sphereVertices} indices={sphereIndices} name={"Sphere"} />
                <br />
                <Object size={state.randomValue} vertices={cylinderVertices} indices={cylinderIndices} name={"Cylinder"} />
            </div>

        </div>
    );
}

export default App;
