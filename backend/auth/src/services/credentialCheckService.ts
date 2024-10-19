export const validateCredentials = (email: string, username: string, password: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minLength = 8;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }
    if (!username || username.trim().length === 0) {
        throw new Error('Username is required');
    }
    if (password.length < minLength) {
        throw new Error('Password must be at least 8 characters long');
    }
    if (!hasUppercase.test(password)) {
        throw new Error('Password must contain at least 1 uppercase letter');
    }
    if (!hasLowercase.test(password)) {
        throw new Error('Password must contain at least 1 lowercase letter');
    }
    if (!hasNumber.test(password)) {
        throw new Error('Password must contain at least 1 number');
    }
    if (!hasSpecialChar.test(password)) {
        throw new Error('Password must contain at least 1 special character');
    }
};
