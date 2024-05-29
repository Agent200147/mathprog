import { create, all } from 'mathjs';
const math = create(all);

export const fn = (f, str,  ...variables) => {
    let scope = {}
    str.forEach((v, i) => scope[v] = variables[i])
    return math.evaluate(f, scope)
}

export const random = (min, max) => Math.random() * (max - min) + min

export const generateNullArr = (size) => new Array(size).fill(0)