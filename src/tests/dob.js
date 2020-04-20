// const created = "2012-12-20T13:28:24.374Z";
// const years = 4.5;

//  const dateInDays = date => parseInt(date / (1000 * 60 * 60 * 24))
//  const distDays = (d1, d2) => dateInDays(d2) - dateInDays(d1)

// console.log(currAge(created, years));
// function currAge(created, years) {
//     const dateCreated = new Date(created)
//     const createdYear = dateCreated.getFullYear() + ((dateCreated.getMonth() + 1) / 12)

//     const currDate = new Date();
//     const currYear = currDate.getFullYear() + ((currDate.getMonth() + 1) / 12)

//     const diff = currYear - createdYear;
//     return diff + years
// }

// console.log(getDOB(years));
// function getDOB(years) {
//     const months = (years % 1) * 12 - 1;
//     const now = new Date()
//     return new Date(now.getFullYear() - parseInt(years) , months ,2)
// }