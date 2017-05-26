export default RegisterService

function RegisterService () {
  let dates = {
    days: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    months: [{'nb': '01', 'name': 'Janvier'}, {'nb': '02', 'name': 'Février'}, {'nb': '03', 'name': 'Mars'}, {'nb': '04', 'name': 'Avril'}, {'nb': '05', 'name': 'Mai'}, {'nb': '06', 'name': 'Juin'}, {'nb': '07', 'name': 'Juillet'}, {'nb': '08', 'name': 'Août'}, {'nb': '09', 'name': 'Septembre'}, {'nb': '10', 'name': 'Octobre'}, {'nb': '11', 'name': 'Novembre'}, {'nb': '12', 'name': 'Décembre'}],
    currentDate: () => {
      return new Date()
    },
    years: () => {
      let date = new Date()
      let currentYear = date.getFullYear()
      let tab = []
      for (var i = 1900; i <= currentYear; i++) {
        tab.push(i.toString())
      }
      return tab
    }
  }
  return {
    dates: dates
  }
}
