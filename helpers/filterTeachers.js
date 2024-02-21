const filterTeachers = (req, data) => {
    const { languages, levels, price_per_hour } = req;
    let filterParams = {}
    let resObj = {};
    // let dataObj = {}
    // console.log('REQ', languages, levels, price_per_hour)
    if (languages.length !== 0) filterParams.languages = languages;
    if (levels.length !== 0) filterParams.levels = levels;
    if (price_per_hour.length !== 0) filterParams.price_per_hour = price_per_hour;

    if (Object.keys(filterParams).length === 0) return data;
    console.log("filterParams", filterParams)

    for (let key in data){
        let dataObj;
        dataObj = data[key];
        // console.log(data[key]);
        // if(isLanguages || data)
        for (let filterParamsKey in filterParams) {
            if (filterParamsKey === 'price_per_hour') {
                if(data[key][filterParamsKey] !== +filterParams[filterParamsKey]){
                    dataObj = null;
                }
                // console.log("data", data[key][filterParamsKey])
            } else {
                console.log("INCLUDES", data[key][filterParamsKey].includes(filterParams[filterParamsKey]))
            }
            // if (!data[key][filterParamsKey].includes(filterParams[filterParamsKey])){
            //     dataObj = null;
            // }
            // if(filterParamsKey !== 'price_per_hour'){
            //     console.log("INCLUDES", data[key][filterParamsKey])

            // }
        }

        // if(Object.keys(dataObj).length !== 0) resObj[key] = dataObj
        if(dataObj) resObj[key] = dataObj
    }

    // console.log("dataObj", dataObj)
    // console.log("resObj", resObj)
}

module.exports = filterTeachers;