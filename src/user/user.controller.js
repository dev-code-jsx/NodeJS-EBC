import bcrypt from 'bcryptjs';
import User from '../user/user.model.js';
import Account from '../account/account.model.js';
import { generateUniqueCode, generateRandomPassword, minMonthlyIncome} from '../helpers/db-validators.js';

export const addUser = async (req, res) => {
    const {
        codeUser,
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

    try {
        await user.save();

        // Crear una cuenta para el usuario registrado
        const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000; // Generar un número de cuenta aleatorio
        const account = new Account({
            idUser: user._id,
            accountNumber,
            balance: 0
        });

        // Guardar cuenta en la base de datos
        await account.save();

        res.status(201).json({ msg: 'User and account created successfully', user, account, password: req.plainPassword});
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error creating user or account' });
    }
};

export const validateAddUser = async (req, res, next) => {
    try {
        minMonthlyIncome(req.body.monthlyIncome);
        req.body.codeUser = await generateUniqueCode();

        const plainPassword = generateRandomPassword();
        req.plainPassword = plainPassword; 

        const salt = bcrypt.genSaltSync();
        req.body.password = bcrypt.hashSync(plainPassword, salt);

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