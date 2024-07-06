import Account from "./account.model.js";
import User from "../user/user.model.js";
import mongoose from "mongoose";

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

export const listFavorites = async (req, res) => {
    const user = req.user.uid;

    try {
        const userDetails = await User.findById(user);

        const account = await Account.findById({ _id: userDetails.accountNumber });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.status(200).json(account.favorites);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export const obtenerCuentasAsc = async (req, res) => {
    try {
        const { order  } = req.body;

        const accounts = await Account.aggregate([
            {
                $lookup: {
                    from: "transactions", // Colección de transacciones
                    localField: "transactions.idTransaction",
                    foreignField: "_id",
                    as: "transactionsDetails"
                }
            },
            {
                $project: {
                    accountNumber: 1,
                    balance: 1,
                    type: 1,
                    favorite: 1,
                    transactions: 1,
                    receivedTransactions: 1,
                    receivedDeposit: 1,
                    createdAt: 1,
                    status: 1,
                    completedTransactionsCount: {
                        $size: {
                            $filter: {
                                input: "$transactionsDetails",
                                as: "transaction",
                                cond: { $eq: ["$$transaction.status", "COMPLETED"] }
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    completedTransactionsCount: order === 'asc' ? 1 : -1
                }
            }
        ]);

        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerDetallesCuenta = async (req, res) => {
    try {
        const { accountId } = req.params;

        const accountDetails = await Account.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(accountId) } },
            {
                $lookup: {
                    from: "transactions",
                    localField: "transactions.idTransaction",
                    foreignField: "_id",
                    as: "transactionsDetails"
                }
            },
            {
                $addFields: {
                    recentTransactions: {
                        $slice: [
                            {
                                $filter: {
                                    input: "$transactionsDetails",
                                    as: "transaction",
                                    cond: { $eq: ["$$transaction.status", "COMPLETED"] }
                                }
                            },
                            5
                        ]
                    }
                }
            },
            {
                $project: {
                    accountNumber: 1,
                    balance: 1,
                    type: 1,
                    favorite: 1,
                    transactions: 1,
                    receivedTransactions: 1,
                    receivedDeposit: 1,
                    createdAt: 1,
                    status: 1,
                    recentTransactions: 1
                }
            }
        ]);

        if (!accountDetails || accountDetails.length === 0) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json(accountDetails[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};