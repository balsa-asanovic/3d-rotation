const SPHERE_DIV = 36;
let i: number, ai: number, si: number, ci: number;
let j: number, aj: number, sj: number, cj: number;
let p1: number, p2: number;

// Vertices
export const vertices: number[] = [], indices: number[] = [];

for (j = 0; j <= SPHERE_DIV; j++) {
    aj = j * Math.PI / SPHERE_DIV;
    sj = Math.sin(aj);
    cj = Math.cos(aj);
    for (i = 0; i <= SPHERE_DIV; i++) {
        ai = i * 2 * Math.PI / SPHERE_DIV;
        si = Math.sin(ai);
        ci = Math.cos(ai);

        vertices.push(si * sj);  // X
        vertices.push(cj);       // Y
        vertices.push(ci * sj);  // Z
    }
}

for (j = 0; j < SPHERE_DIV; j++) {
    for (i = 0; i < SPHERE_DIV; i++) {
        p1 = j * (SPHERE_DIV + 1) + i;
        p2 = p1 + (SPHERE_DIV + 1);

        indices.push(p1);
        indices.push(p2);
        indices.push(p1 + 1);

        indices.push(p1 + 1);
        indices.push(p2);
        indices.push(p2 + 1);
    }
}

