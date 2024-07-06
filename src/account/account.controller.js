import Account from "..account/account.model.js";
import User from "../user/user.model.js";

export const addFavorite = async (req, res) => {
    const user = req.user.uid;

    try {
        const userDetails = await User.findById(user);

        const account = await Account.findById({ _id: userDetails.accountNumber });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const { accountNumber, alias } = req.body;

        const accountExists = await Account.findById(accountNumber);

        if (!accountExists) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const favorite = {
            accountNumber,
            alias
        };

        account.favorites.push(favorite);

        await account.save();

        res.status(201).json({ message: 'Favorite added successfully', favorite });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

