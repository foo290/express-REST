const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


function validateEmail(email){
    return true? emailRegexp.test(email): false
}

function validateEssentialFields(allowedFields, fields){
    for ([key, value] of Object.entries(allowedFields)){
        if (!key in fields || typeof fields[key] != value){
            return false
        }
        return true
    }
}

module.exports = {
    validateEmail,
    validateEssentialFields
}