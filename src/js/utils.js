export const dateInDays = date => parseInt(date / (1000 * 60 * 60 * 24))
export const distDays = (d1, d2) => dateInDays(d2) - dateInDays(d1)


export const dateFormatDMY = (date) => {
    const y = date.getFullYear();
    let m = date.getMonth(); m++;
    if (Number(m).toString() < 10) m = "0" + m
    let d = date.getDate();
    if (Number(d).toString() < 10) d = "0" + d;
    if (isNaN(y) || isNaN(m) || isNaN(d)) return ""
    const output = d + "/" + m + "/" + y;
    return output;
}

export function isArrayEquals(a1, a2) {
    let isEq = true
    if (a1.length != a2.length) return false
    a1.forEach(el => {
        if (!a2.includes(el)) isEq = isEq && false
    });
    return isEq
}