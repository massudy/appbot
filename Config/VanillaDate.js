const VanillaDate = {
    DaysOnMonth : (year,month) => {
        return new Date(year,month,0).getDate()
    }

}

export default VanillaDate

//console.log(new Date().getFullYear())