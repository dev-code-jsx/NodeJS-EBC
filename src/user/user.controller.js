import bcrypt from 'bcryptjs';
import User from '../user/user.model.js';
import { generateUniqueCode, generateRandomPassword } from '../helpers/db-validators.js';

export const addUser = async (req, res) => {
    const { codeUser,
        password,
        username,
        names,
        lastNames,
        role,
        dpi,
        address,
        phone,
        email,
        job,
        monthlyIncome,
        status
    } = req.body;

    const user = new User({
        codeUser, password, username, names, lastNames, role, 
        dpi, address, phone, email, job, monthlyIncome, status 
    });

    await user.save();

    res.status(201).json({ msg: 'User created successfully', user });
}

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


export const getUsers = async (req, res) => {
    const users = await User.find();

    res.status(200).json(users);
}