const ctrlWrapper = (method) => {
    const fn = async (req, res, next) => {
        try {
            await method(req, res, next);
        } catch (error) {
            next(error);
        }
    } 

    return fn;
}

module.exports = ctrlWrapper;