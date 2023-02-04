const EmailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const validateName = (name, el) => {
    let err = null;
    if (!name) {
        err = "Please enter the name";
    } else if (name.length < 3) {
        err = "Name should be atleast 3 characters long";
    }
    el.setError(err);
    return !err;
};

export const validateEmail = (email, el) => {
    let err = null;
    if (!email) {
        err = "Please enter the email address";
    } else if (!EmailRegex.test(email)) {
        err = "Invalid email address";
    }
    el.setError(err);
    return !err;
};

export const validateUsername = (email, el) => {
    let err = null;
    if (!email) {
        err = "Please enter the username";
    }

    el.setError(err);
    return !err;
};

export const validatePassword = (password, el, isRegister) => {
    let err = null;
    if (!password) {
        err = "Please enter the password";
    } else if (password.length < 5) {
        err = isRegister ? "Password should be atleast 5 characters" : "Incorrect password";
    }
    el.setError(err);
    return !err;
};

export const validateConfirmPassword = (password, confirmPassword, el) => {
    let err = null;
    if (!confirmPassword) {
        err = "Please re-enter the password";
    } else if (password !== confirmPassword) {
        err = "Passwords doesn't match";
    }
    el.setError(err);
    return !err;
};
