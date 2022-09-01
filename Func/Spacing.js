const Spacing = (spaces) => {
    let spacingtext = ""
    if(spaces > 0){
        const repeat = [...Array(spaces)]
        repeat.forEach((e,i) => {
            spacingtext = `${spacingtext}⠀`
           })

    }
return spacingtext
}

export default Spacing