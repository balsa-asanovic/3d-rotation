import React, { useEffect, useReducer } from 'react';
import './App.css';
import Cube from './components/Cube/Cube';
import Sphere from './components/Sphere/Sphere';
import Cylinder from './components/Cylinder/Cylinder';
import { io } from 'socket.io-client';

type State = {
    randomValue: number;
    frequency: number;
    disabled: boolean;
};

type Action =
    | { type: 'SET_RANDOM_VALUE'; value: number }
    | { type: 'SET_FREQUENCY'; value: number }
    | { type: 'TOGGLE_DISABLED' };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_RANDOM_VALUE':
            return { ...state, randomValue: action.value };
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
        frequency: 100,
        disabled: true,
    });


    useEffect(() => {
        const socket = io("ws://fierce-gorge-53680.herokuapp.com/");
        socket.emit("frequency", state.frequency);
        socket.on("message", (data) => {
            if (!state.disabled)
                dispatch({ type: 'SET_RANDOM_VALUE', value: Number(data) });
        })

        return () => {
            socket.off("message");
        };
    }, [state.frequency, state.disabled]);

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
            Disable: <input type="checkbox" onChange={() => dispatch({ type: 'TOGGLE_DISABLED' })} checked={state.disabled} />
            <br />
            <br />
            <div>
                <Cube width={state.randomValue} />
                <br />
                <Sphere width={state.randomValue} />
                <br />
                <Cylinder width={state.randomValue} />
            </div>

        </div>
    );
}

export default App;
