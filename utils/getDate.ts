const getDate = () => {

        let dateFormat = ''
        const date = new Date()
    
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        if (month < 10 && day > 9)
                dateFormat = `${year}-0${month}-${day}`;
            if (month < 10 && day >= 10)
                dateFormat = `${year}-0${month}-${day}`;
            if (month >= 10 && day < 10)
                dateFormat = `${year}-${month}-0${day}`;
            if (month >= 10 && day >= 10)
                dateFormat = `${year}-${month}-${day}`;
            if ( month < 10 && day < 10)
            dateFormat = `${year}-0${month}-0${day}`;

        return  dateFormat 
    
}

export { getDate }