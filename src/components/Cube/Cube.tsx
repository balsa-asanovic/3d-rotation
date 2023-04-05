import React, { useRef, useEffect } from 'react';
import { glMatrix, mat4 } from 'gl-matrix';
import { cubeVertices, cubeIndices } from './cubeData';

type cubeProps = {
    width: number
}

const Cube = ({ width }: cubeProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        let gl = canvas?.getContext('webgl');

        // if (!gl) {
            //gl = canvas?.getContext('experimental-webgl');
        //}

        // background color
        gl?.clearColor(0.75, 0.85, 0.8, 1.0);
        // specifiy which buffers to clear, depth is for the Z index concept
        gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl?.enable(gl.DEPTH_TEST);
        gl?.enable(gl.CULL_FACE); // saving operations by not rendering what is begind and not visible
        gl?.frontFace(gl.CCW);
        gl?.cullFace(gl.BACK);


        const vertexShaderText: string = `
            precision mediump float;

            attribute vec3 vertPosition;
            attribute vec3 vertColor;

            varying vec3 fragColor;

            uniform mat4 mWorld;
            uniform mat4 mView;
            uniform mat4 mProj;

            void main()
            {
                fragColor = vertColor;
                gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
            }
        `;

        const fragmentShaderText: string = `
            precision mediump float;

            varying vec3 fragColor;

            void main()
            {
                gl_FragColor = vec4(fragColor, 1.0);
            }
        `;

        const vertexShader = gl?.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl?.createShader(gl.FRAGMENT_SHADER);

        if (vertexShader) {
            gl?.shaderSource(vertexShader, vertexShaderText);
            gl?.compileShader(vertexShader);
            if (!gl?.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
                console.error('ERROR compiling vertex shader', gl?.getShaderInfoLog(vertexShader));
                return;
            }
        }

        if (fragmentShader)
        {
            gl?.shaderSource(fragmentShader, fragmentShaderText);
            gl?.compileShader(fragmentShader);
            if (!gl?.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
                console.error('ERROR compiling fragment shader', gl?.getShaderInfoLog(fragmentShader));
                return;
            }
        }

        const program = gl?.createProgram();
        if (program && vertexShader && fragmentShader) {
            gl?.attachShader(program, vertexShader);
            gl?.attachShader(program, fragmentShader);

            gl?.linkProgram(program);
            if(!gl?.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('ERROR linking program!', gl?.getProgramInfoLog(program));
                return;
            }

            gl?.validateProgram(program);
            if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
                console.error("ERROR validating program!", gl.getProgramInfoLog(program));
                return;
            }
        }

        // create buffer
        const cubeVertexBufferObject = gl?.createBuffer();
        gl?.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBufferObject!);
        gl?.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices.map((item) => {return Math.abs(item) === 1 ? item * width : item})), gl.STATIC_DRAW);

        const cubeIndexBufferObject = gl?.createBuffer();
        gl?.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBufferObject!);
        gl?.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW)

        const positionAttribLocation = gl?.getAttribLocation(program as WebGLProgram, 'vertPosition');
        const colorAttribLocation = gl?.getAttribLocation(program as WebGLProgram, 'vertColor');
        gl?.vertexAttribPointer(
            positionAttribLocation as number, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            false, // wether the data is normalized
            6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex,
            0 // Offset from the beginning of a size vertex to this attribute
        );
        gl?.vertexAttribPointer(
            colorAttribLocation as number, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            false, // wether the data is normalized
            6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex,
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a size vertex to this attribute
        );

        gl?.enableVertexAttribArray(positionAttribLocation as number);
        gl?.enableVertexAttribArray(colorAttribLocation as number);

        // Tell OpenGL state machine which program should be active
        gl?.useProgram(program!);

        let matWorldUniformLocation = gl?.getUniformLocation(program!, 'mWorld');
        const matViewUniformLocation = gl?.getUniformLocation(program!, 'mView');
        const matProjUniformLocation = gl?.getUniformLocation(program!, 'mProj');

        if (matWorldUniformLocation === null || matViewUniformLocation === null || matProjUniformLocation === null) {
            console.error("Uniform locations are not valid.");
            return;
          }

        const worldMatrix = new Float32Array(16);
        const viewMatrix = new Float32Array(16);
        const projMatrix = new Float32Array(16);

        mat4.identity(worldMatrix);
        mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
        mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas?.width! / canvas?.height!, 0.1, 1000.0);

        if (matWorldUniformLocation)
            gl?.uniformMatrix4fv(matWorldUniformLocation, false, worldMatrix);
        if (matViewUniformLocation)
            gl?.uniformMatrix4fv(matViewUniformLocation, false, viewMatrix);
        if (matProjUniformLocation)
            gl?.uniformMatrix4fv(matProjUniformLocation, false, projMatrix);

        const xRotationMatrix = new Float32Array(16);
        const yRotationMatrix = new Float32Array(16);

        // Main render loop
        const identityMatrix = new Float32Array(16);
        mat4.identity(identityMatrix);
        let angle = 0;
        const loop = () => {
            angle = performance.now() / 1000 / 6 * 2 * Math.PI;
            mat4.rotate(xRotationMatrix, identityMatrix, angle, [1, 0, 0]);
            mat4.rotate(yRotationMatrix, identityMatrix, angle / 4, [0, 1, 0]);
            mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
                
            matWorldUniformLocation = gl?.getUniformLocation(program!, 'mWorld');
            gl?.uniformMatrix4fv(matWorldUniformLocation!, false, worldMatrix);

            gl?.clearColor(0.75, 0.85, 0.8, 1);
            gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl?.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);

    }, [width]);

    return (
        <canvas ref={canvasRef} id="cube-canvas" width="800" height="600">
            Your browser does not support HTML5
        </canvas>
    )
}

export default Cube;