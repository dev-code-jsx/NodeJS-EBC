import { response } from 'express'
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
        status,
        type
    } = req.body;
    
    
    try {
        
        // Crear una cuenta para el usuario registrado
        const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000; // Generar un número de cuenta aleatorio
        const account = new Account({
            accountNumber,
            balance: 0,
            type: type
        });
        
        // Guardar cuenta en la base de datos
        await account.save();
        const user = new User({
            codeUser, password, username, names, lastNames, role,
            dpi, address, phone, email, job, monthlyIncome, status
        });

        const cuenta = await Account.findOne({ accountNumber: accountNumber });
        console.log(cuenta);
        user.accountNumber = cuenta;
        
        await user.save();

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

export const updateUser = async (req, res) => {
    const { id} = req.params;
    const {password, ...rest } = req.body;

    if (password) {
        const salt = bcrypt.genSaltSync();
        rest.password = bcrypt.hashSync(password, salt);
    }

    try {
        const user = await User.findByIdAndUpdate(id, rest);

        res.status(200).json({ msg: 'User updated successfully', user });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Error updating user' });
    
    }

}

export const getUsers = async (req, res) => {
    const users = await User.find();

    res.status(200).json(users);
}

export const adminD = async (res = response) => {
    const adminDefault = new User({
        codeUser: "ADMINB",
        password: bcrypt.hashSync("ADMINB", 10),
        username: "ADMIN",
        names: "ADMIN",
        lastNames: "ADMIN",
        role: "ADMIN",
        dpi: 383992212,
        address: "ADMIN",
        phone: 12345678,
        email: "admin@gmail.com",
        job: "ADMIN",
        monthlyIncome: 150,
        status: "ASSET"
    });

    await adminDefault.save();
}

export const adminExists = async (req, res) => {
    const admin = await User.findOne({ codeUser: "ADMINB" });

    if (!admin) {
        adminD(res);
    }
}