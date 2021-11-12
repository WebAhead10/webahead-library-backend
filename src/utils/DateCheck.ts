const moment = require('moment')

const DateCheck = function (month: string, year: string) {
  let returnDayDate = 0
  switch (month) {
    case '01':
    case '03':
    case '05':
    case '07':
    case '08':
    case '10':
    case '12':
      returnDayDate = 31
      break
    case '04':
    case '06':
    case '09':
    case '11':
      returnDayDate = 30
      break
    case '02':
      if (moment('29/02/{year}', 'DD/MM/YYYY', true).isValid()) {
        returnDayDate = 29
      } else {
        returnDayDate = 28
      }
      break
  }
  //console.log('it is ', returnDayDate)//only for test
  return returnDayDate
}

export default DateCheck
