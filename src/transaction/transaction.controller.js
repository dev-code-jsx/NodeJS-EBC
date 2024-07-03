import Transaction from './transaction.model.js';
import Account from '../account/account.model.js';
import User from '../user/user.model.js';

export const performTransaction = async (req, res) => {
    const user = req.user.uid;

    const detailsUser = await User.findById(user);
    const details = await Account.findOne({ _id: detailsUser.accountNumber });

    if (details.balance < amount) {
        return res.status(400).json({ message: 'Insufficient funds' });
    } else {
        const newBalance = details.balance - amount;
        await Account.findOneAndUpdate({ _id: detailsUser.accountNumber }, { balance: newBalance });

        const cuentaDestino = await Account.findOne({ accountNumber });
        cuentaDestino.balance += amount;
        await cuentaDestino.save();

        const typeTransaction = 'TRANSFER';
        const transaction = new Transaction({
            amount, 
            type: typeTransaction, 
            fromAccount: details.accountNumber, 
            toAccount: { dpi, accountNumber }, 
            status: 'PENDING',
            reversible: true
        });

        await transaction.save();

        // guardar transaccion en cuenta origen
        details.transactions.push(transaction._id);
        await details.save();

        // guardar transaccion en cuenta destino
        cuentaDestino.receivedTransactions.push(transaction._id);
        await cuentaDestino.save();

        // Configurar el temporizador de 10 minutos
        setTimeout(async () => {
            const trans = await Transaction.findById(transaction._id);
            if (trans && trans.reversible) {
                trans.status = 'COMPLETED';
                trans.reversible = false;
                await trans.save();
            }
        }, 10 * 60 * 1000); 

        res.status(201).json({ message: 'Transaction initiated successfully, pending for 10 minutes' });
    }
}

export const revertirTransaccion = async (req, res) => {
    const userId = req.user.uid;
    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction || !transaction.reversible) {
        return res.status(400).json({ message: 'Transaction cannot be reverted' });
    }

    if (transaction.userId !== userId) {
        return res.status(403).json({ message: 'You do not have permission to revert this transaction' });
    }

    const fromAccount = await Account.findOne({ accountNumber: transaction.fromAccount });
    const toAccount = await Account.findOne({ accountNumber: transaction.toAccount.accountNumber });

    fromAccount.balance += transaction.amount;
    toAccount.balance -= transaction.amount;

    await fromAccount.save();
    await toAccount.save();

    transaction.status = 'REVERTED';
    transaction.reversible = false;
    await transaction.save();

    res.status(200).json({ message: 'Transaction reverted successfully' });
}
