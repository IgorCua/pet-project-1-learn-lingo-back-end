const filterTeachers = (req, data) => {
    const { languages, levels, price_per_hour } = req;
    let filterParams = {}
    let resObj = {};
    console.log(req)
    if (languages.length !== "All") filterParams.languages = languages;
    if (levels.length !== "All") filterParams.levels = levels;
    if (price_per_hour.length !== "All") filterParams.price_per_hour = price_per_hour;

    // if (Object.keys(filterParams).length === 0) return data;
    if (languages ===  "All" && levels === "All" && price_per_hour === "All") return data;

    for (let key in data){
        let dataObj;
        
        dataObj = data[key];

        for (let filterParamsKey in filterParams) {
            if (filterParamsKey === 'price_per_hour') {
                if(data[key][filterParamsKey] !== +filterParams[filterParamsKey]){
                    dataObj = null;
                }
            } else {
                if (!data[key][filterParamsKey].includes(filterParams[filterParamsKey])){
                    dataObj = null
                }
            }
        }

        if(dataObj) resObj[key] = dataObj
    }

    // console.log("dataObj", dataObj)
    // console.log("resObj", resObj)
    return resObj;
}

module.exports = filterTeachers;