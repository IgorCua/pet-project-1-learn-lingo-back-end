const filterTeachers = (req, data) => {
    const { languages, levels, price_per_hour } = req;
    let filterParams = {}
    let resObj = {};
    
    if (languages.length !== "All") filterParams.languages = languages;
    if (levels.length !== "All") filterParams.levels = levels;
    if (price_per_hour.length !== "All") filterParams.price_per_hour = price_per_hour;

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

    return resObj;
}

module.exports = filterTeachers;