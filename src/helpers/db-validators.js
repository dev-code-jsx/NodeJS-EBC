import bcrypt from 'bcryptjs';
import User from '../user/user.model.js';

const generateRandomCode = () => {
    const length = 6; // Define la longitud del código
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomDigit = Math.floor(Math.random() * 10); // Genera un dígito aleatorio entre 0 y 9
        code += randomDigit;
    }
    return code;
};

const isUniqueCodeUser = async (codeUser) => {
    const user = await User.findOne({ codeUser });
    return !user;
};

const generateUniqueCode = async () => {
    let codeUser;
    let isUnique = false;

    while (!isUnique) {
        codeUser = generateRandomCode();
        isUnique = await isUniqueCodeUser(codeUser);
    }
    

    return codeUser;
};

const generateRandomPassword = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

export const validateAddUser = async (req, res, next) => {
    try {
        req.body.codeUser = await generateUniqueCode();
        const password = generateRandomPassword();

        const salt = bcrypt.genSaltSync();
        req.body.password = bcrypt.hashSync(password, salt);

        next();
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Error in middleware' });
    }
};

export const existUser = async ( username = '') => {
    const existenteUser = await User.findOne({ username });
    if (existenteUser) {
        throw new Error(`The user ${username} already exists`);
    }
}