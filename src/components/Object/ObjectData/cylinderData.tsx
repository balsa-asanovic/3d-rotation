
// export const vertices = [5.0,10.0,0.0,5.0,0.0,0.0,4.75528,10.0,-1.54508,4.75528,0.0,-1.54508,4.04508,10.0,-2.93893,4.04508,0.0,-2.93893,2.93893,10.0,-4.04508,2.93893,0.0,-4.04508,1.54508,10.0,-4.75528,1.54508,0.0,-4.75528,-1.02552e-09,10.0,-5.0,-1.02552e-09,0.0,-5.0,-1.54508,10.0,-4.75528,-1.54508,0.0,-4.75528,-2.93893,10.0,-4.04508,-2.93893,0.0,-4.04508,-4.04508,10.0,-2.93893,-4.04508,0.0,-2.93893,-4.75528,10.0,-1.54508,-4.75528,0.0,-1.54508,-5.0,10.0,2.05103e-09,-5.0,0.0,2.05103e-09,-4.75528,10.0,1.54508,-4.75528,0.0,1.54508,-4.04508,10.0,2.93893,-4.04508,0.0,2.93893,-2.93893,10.0,4.04508,-2.93893,0.0,4.04508,-1.54508,10.0,4.75528,-1.54508,0.0,4.75528,3.07655e-09,10.0,5.0,3.07655e-09,0.0,5.0,1.54508,10.0,4.75528,1.54508,0.0,4.75528,2.93893,10.0,4.04508,2.93893,0.0,4.04508,4.04508,10.0,2.93893,4.04508,0.0,2.93893,4.75528,10.0,1.54508,4.75528,0.0,1.54508,5.0,10.0,0.0,4.75528,10.0,-1.54508,4.75528,10.0,1.54508,4.04508,10.0,2.93893,2.93893,10.0,4.04508,1.54508,10.0,4.75528,3.07655e-09,10.0,5.0,-1.54508,10.0,4.75528,-2.93893,10.0,4.04508,-4.04508,10.0,2.93893,-4.75528,10.0,1.54508,-5.0,10.0,2.05103e-09,-4.75528,10.0,-1.54508,-4.04508,10.0,-2.93893,-2.93893,10.0,-4.04508,4.04508,10.0,-2.93893,2.93893,10.0,-4.04508,-1.54508,10.0,-4.75528,-1.02552e-09,10.0,-5.0,1.54508,10.0,-4.75528,3.07655e-09,0.0,5.0,-1.54508,0.0,4.75528,1.54508,0.0,4.75528,2.93893,0.0,4.04508,4.04508,0.0,2.93893,4.75528,0.0,1.54508,5.0,0.0,0.0,4.75528,0.0,-1.54508,4.04508,0.0,-2.93893,2.93893,0.0,-4.04508,1.54508,0.0,-4.75528,-1.02552e-09,0.0,-5.0,-1.54508,0.0,-4.75528,-2.93893,0.0,-4.04508,-4.04508,0.0,-2.93893,-2.93893,0.0,4.04508,-4.04508,0.0,2.93893,-4.75528,0.0,-1.54508,-5.0,0.0,2.05103e-09,-4.75528,0.0,1.54508].map(item => item * 0.17);
// export const indices = [0,1,2,3,2,1,2,3,4,4,3,5,4,5,6,7,6,5,6,7,8,8,7,9,8,9,10,11,10,9,10,11,12,13,12,11,12,13,14,14,13,15,14,15,16,17,16,15,16,17,18,18,17,19,18,19,20,21,20,19,20,21,22,23,22,21,22,23,24,24,23,25,24,25,26,27,26,25,26,27,28,28,27,29,28,29,30,31,30,29,30,31,32,33,32,31,32,33,34,34,33,35,34,35,36,37,36,35,36,37,38,38,37,39,38,39,0,1,0,39,40,41,42,42,41,43,43,41,44,44,41,45,45,41,46,46,41,47,47,41,48,48,41,49,49,41,50,50,41,51,51,41,52,52,41,53,53,41,54,41,55,54,55,56,54,54,56,57,57,56,58,59,58,56,60,61,62,62,61,63,63,61,64,64,61,65,65,61,66,66,61,67,67,61,68,68,61,69,69,61,70,70,61,71,71,61,72,72,61,73,73,61,74,61,75,74,75,76,74,74,76,77,77,76,78,79,78,76];

export const createCylinderVertices = (
    radiusTop: number,
    radiusBottom: number,
    height: number,
    radialSegments: number,
    heightSegments: number,
    openEnded: boolean
): { vertices: number[]; indices: number[] } => {
    const halfHeight = height / 2;
    const vertices: number[] = [];
    const indices: number[] = [];
    let index = 0;
    const indexArray: number[][] = [];

    // Generate vertices and normals
    for (let y = 0; y <= heightSegments; y++) {
        const indexRow: number[] = [];
        const v = y / heightSegments;
        const radius = v * (radiusBottom - radiusTop) + radiusTop;
        for (let x = 0; x <= radialSegments; x++) {
            const u = x / radialSegments;
            const theta = u * Math.PI * 2;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
            vertices.push(radius * sinTheta);
            vertices.push(-v * height + halfHeight);
            vertices.push(radius * cosTheta);
            indexRow.push(index++);
        }
        indexArray.push(indexRow);
    }

    // Generate indices
    for (let x = 0; x < radialSegments; x++) {
        for (let y = 0; y < heightSegments; y++) {
            const a = indexArray[y][x];
            const b = indexArray[y + 1][x];
            const c = indexArray[y + 1][x + 1];
            const d = indexArray[y][x + 1];
            indices.push(a, b, d);
            indices.push(b, c, d);
        }
    }

    // Generate top cap
    if (!openEnded && radiusTop > 0) {
        vertices.push(0, halfHeight, 0);
        for (let x = 0; x < radialSegments; x++) {
            const a = indexArray[0][x];
            const b = indexArray[0][x + 1];
            const c = index;
            indices.push(a, b, c);
        }
        index++;
    }

    // Generate bottom cap
    if (!openEnded && radiusBottom > 0) {
        vertices.push(0, -halfHeight, 0);
        for (let x = 0; x < radialSegments; x++) {
            const a = indexArray[heightSegments][x + 1];
            const b = indexArray[heightSegments][x];
            const c = index;
            indices.push(a, b, c);
        }
        index++;
    }

    return { vertices, indices };
}

const cylinder = createCylinderVertices(1, 1, 3, 200, 200, false);
export const cylinderVertices = cylinder.vertices;
export const cylinderIndices = cylinder.indices;
