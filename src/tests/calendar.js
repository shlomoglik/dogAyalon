// const breakAfterMonths = 12

// let month = 1;
// let year = 2020;
// let day = 2;



// // let breakMonth = month + breakAfterMonths - 1;
// // let breakYear = year + 0

// // TESTME:
// const countTotalMonth = breakAfterMonths + (month - 1)

// const yearsPlus = parseInt(countTotalMonth / 12);
// const monthsPlus = 12 * ((countTotalMonth / 12) % 1);

// let breakMonth = (month + monthsPlus) % 12 === 0 ? 12 : (month + monthsPlus) % 12;
// let breakYear = year + yearsPlus
// console.log("break month = ", breakMonth, " break year = ", breakYear)

// const getDate = () => new Date(year, month - 1, day, 0)
// const breakRule = () => {
//     return (month === breakMonth && year === breakYear)
// }

// let count=0
// while (breakRule()===false && count<380) {
//     const d = getDate();
//     console.log(d.toISOString())
//     // if (d.getMonth() + 1 !== month) {
//     //     month++
//     //     day = 2
//     // } else {
//     //     day++
//     // }
//     day++
//     count++
// }




// const dates = [];
// const year = 2020
// const month = 12;
// let d = 2;
// let m = month;
// while (m === month) {
//     const date = new Date(year, month - 1, d)
//     m = date.getMonth() + 1;
//     dates.push(date.toISOString())
//     d++;
// }
// console.log(dates)


// const daysOfWeek = [
//     {
//         label: "ראשון"
//     },
//     {
//         label: "שני"
//     },
//     {
//         label: "שלישי"
//     },
//     {
//         label: "רביעי"
//     },
//     {
//         label: "חמישי"
//     },
//     {
//         label: "שישי"
//     },
//     {
//         label: "שבת"
//     },
// ]
// const today = new Date()
// const day = today.getDay()
// console.log(daysOfWeek[day-1].label)