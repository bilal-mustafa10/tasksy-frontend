export const usernameValidator = (username) => {
    //const re = /\S+@\S+\.\S+/;
    const re = /\S+/;

    if (!username || username.length <= 0) {
        return 'Username cannot be empty.';
    }
    if (!re.test(username)) {
        return 'Ooops! We need a valid username address.';
    }

    return '';
};

export const passwordValidator = (password) => {
    if (!password || password.length <= 0) {
        return 'Password cannot be empty.';
    }

    return '';
};

export const nameValidator = (name) => {
    const re = /^[a-zA-Z ]+$/;
    if (!name || name.length <= 0) {
        return 'Name cannot be empty.';
    }

    if (!re.test(name)) {
        return 'Ooops! We need a valid name.';
    }

    return '';
};

export const emailValidator = (email) => {
    const re = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!email || email.length <= 0) {
        return 'Email cannot be empty.';
    }

    if (!re.test(email)) {
        return 'Ooops! We need a valid email.';
    }

    return '';
};
