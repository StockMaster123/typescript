

const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){5,15}$/) //la contraseña tiene que ser mayor a 8 carácteres y menor de 15, asimismo tiene que tener al menos una mayúscula y una carácter especial

const validatePassword = (password:string) => {
    var testResult = regex.test(password)
    return testResult
}

export { validatePassword }