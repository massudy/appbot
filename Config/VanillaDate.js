const Months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]

const VanillaDate = {
    DaysOnMonth : (year,month) => {
        return new Date(year,month,0).getDate()
    },

    ActualMonth : () => {
        return new Date().getMonth()
    },

    MonthName : (month_number) => {
        return Months[month_number]
    },
    AllMonths : () => {
        return Months
    },
    GetYear : () => {
        return new Date().getFullYear()
    }

}

export default VanillaDate