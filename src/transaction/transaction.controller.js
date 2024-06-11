import Transaction from './transaction.model.js';
import Account from '../account/account.model.js';
import User from '../user/user.model.js';

export const performTransaction = async (req, res) => {
    const user = req.user.uid;

    const { amount, type, dpi, accountNumber, status } = req.body;

    const detailsUser = await User.findById(user);

    const details = await Account.findOne({ _id: detailsUser.accountNumber });

    if (details.balance < amount) {
        return res.status(400).json({
            message: 'Insufficient funds'
        });
    } else {
        const newBalance = details.balance - amount;

        await Account.findOneAndUpdate({ _id: detailsUser.accountNumber }, { balance: newBalance });

        const cuentaDestino = await Account.findOne({ accountNumber: accountNumber });

        cuentaDestino.balance += amount;
        await cuentaDestino.save();

        const typeTransaction = 'TRANSFER';
        const status = 'COMPLETED'
        const transaction = new Transaction({
            amount, type: typeTransaction, fromAccount: details.accountNumber, toAccount: { dpi, accountNumber }, status: status
        });

        await transaction.save();


        // guardar transaccion en cuenta origen
        details.transactions.push(transaction._id);
        await details.save();
        // guardar transaccion en cuenta destino
        cuentaDestino.receivedTransactions.push(transaction._id);
        await cuentaDestino.save();


        res.status(201).json({
            message: 'Transaction completed successfully'
        });
    }
}