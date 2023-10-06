import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AccountsPage from './Pages/AccountsPage';
import CreateAccountPage from './Pages/CreateAccountPage';
import TransactionsPage from './Pages/TransactionsPage';
import TransferPage from './Pages/TransferPage';
import Home from './Pages/Home';
import NewTransactions from './Pages/NewTransactions-BudgetApp';
import Modal from 'react-modal'

function App() {
  const [transactions, setTransactions] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editTransactionData, setEditTransactionData] = useState({});
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [modalMode, setModalMode] = useState('edit');

  // Function to add a new transaction
  const addTransaction = (newTransaction) => {
    setTransactions([...transactions, newTransaction]);
    
    // Deduct the transaction amount from the balance
    setBalance(balance - newTransaction.amount);
  };

  // Function to open the edit modal
  const openEditModal = (transaction) => {
    setEditTransactionData(transaction);
    setModalMode('edit');
    setModalIsOpen(true);
  };

  // Function to close the edit modal
  const closeEditModal = () => {
    setModalIsOpen(false);
  };

  // Function to save edited transaction
  const saveEditedTransaction = (editedTransaction) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === editedTransaction.id ? editedTransaction : transaction
    );
    setTransactions(updatedTransactions);
    setModalIsOpen(false);
  };

  // Function to open the delete modal
  const openDeleteModal = (transactionId) => {
      // Check if a transaction with the given transactionId exists in editTransactionData
  const isEditing = !!transactions.find((transaction) => transaction.id === transactionId);
  
  if (isEditing) {
    // If a transaction with the given transactionId is being edited, close the edit modal
    closeEditModal();
  }

  // Set the modal mode to "delete"
    setModalMode('delete');
    setDeleteTransactionId(transactionId);
    setModalIsOpen(true);
  };

  // Function to confirm and delete a transaction
  const confirmDeleteTransaction = () => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== deleteTransactionId
    );
    setTransactions(updatedTransactions);
    setModalIsOpen(false);
    setDeleteTransactionId(null);
  };
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/transfer" element={<TransferPage />} />
        <Route
          path="/new-transactions"
          element={
            <div>
              <NewTransactions onAddTransaction={addTransaction} />
              <div className='tranx-history'>
                <h3>Transaction History</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Text</th>
                      <th>Amount</th>
                      <th>Owner</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.date}</td>
                        <td>{transaction.selectCategory}</td>
                        <td>{transaction.text}</td>
                        <td>{transaction.amount}</td>
                        <td>{transaction.owner}</td>
                        <td>
                          <button onClick={() => openEditModal(transaction)}>Edit</button>
                          <button onClick={() => openDeleteModal(transaction.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
               {/* Edit and Delete Modals */}        
           <Modal
             isOpen={modalIsOpen}
             onRequestClose={closeEditModal}
             ariaHideApp={false} // To prevent a warning
            >
              {modalMode === 'edit' && editTransactionData.id ? (
                  <>
                    <h2>Edit Transaction</h2>
                    <form>
                      {/* Populate the form fields with editTransactionData */}
                      <label htmlFor="owner">Owner/Payee: </label>
                      <input
                        type="text"
                        id="owner"
                        value={editTransactionData.owner}
                        onChange={(e) =>
                          setEditTransactionData({
                            ...editTransactionData,
                            owner: e.target.value,
                          })
                        }
                        /><br></br>
                      <label htmlFor="selectCategory">Category: </label>
                      <select
                      id="selectCategory"
                      value={editTransactionData.selectCategory}
                      onChange={(e) => setEditTransactionData({...editTransactionData, selectCategory: e.target.value,})
                      }>
                        <option value="" disabled>Please select...</option>
                        <option value="Food and Drinks">Food and Drinks</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Communications">Communications</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Personal Care">Personal Care</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Holidays">Holidays</option>
                        <option value="Investments">Investments</option>
                        <option value="Subscriptions">Subscriptions</option>
                      </select>
                        <br></br>
                      <label htmlFor="text">Name of Expense: </label>
                      <input
                        type="text"
                        id="name-of-tranx"
                        value={editTransactionData.text}
                        onChange={(e) =>
                          setEditTransactionData({
                            ...editTransactionData,
                            text: e.target.value,
                          })
                        }
                      /><br></br>
                      <label htmlFor="amount">Amount: </label>
                      <input
                        type="number"
                        id="amount"
                        value={editTransactionData.amount}
                        onChange={(e) =>
                          setEditTransactionData({
                            ...editTransactionData,
                            amount: e.target.value,
                          })
                        }
                      /><br></br>
                      <label htmlFor="date">Date: </label>
                      <input
                        type="date"
                        id="date"
                        value={editTransactionData.date}
                        onChange={(e) =>
                          setEditTransactionData({
                            ...editTransactionData,
                            date: e.target.value,
                          })
                        }
                      /><br></br>
                      <button onClick={closeEditModal}>Cancel</button>
                      <button onClick={() => saveEditedTransaction(editTransactionData)}>Save</button>
                    </form>
                  </>
                ) : (
                  <>
                    <h2>Confirm Delete</h2>
                    <p>Are you sure you want to delete this transaction?</p>
                    <button onClick={closeEditModal}>Cancel</button>
                   <button onClick={confirmDeleteTransaction}>Delete</button>
                  </>
                )}
              </Modal>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

export const accounts = [
  { firstName: 'John', lastName: 'Doe', client1Balance: 1000 },
  { firstName: 'Jane', lastName: 'Doe', client1Balance: 500 },
];

export const addAccount = (account) => {
  accounts.push(account);
};