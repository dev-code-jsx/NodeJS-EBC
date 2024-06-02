import bcryptjs from 'bcryptjs';
import User from '../user/user.model.js';
import { generateJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const { codeUser, password } = req.body;

    try {
        const user = await User.findOne({ codeUser });

        if (!user) {
            return res.status(400).json({
                msg: 'Incorrect codeUser or password'
            });
        }

        if (!user.status) {
            return res.status(400).json({
                msg: 'User disabled'
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Incorrect codeUser or password'
            });
        }

        const token = await generateJWT(user.id);

        res.json({
            msg: 'Login success',
            user,
            token
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Contact the administrator'
        });
    }
}