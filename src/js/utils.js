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