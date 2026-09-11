// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { TransactionProvider } from './context/TransactionContext'; // Импортируем провайдер
import { AccountsProvider } from './context/AccountsContext';
import { CategoriesProvider } from './context/CategoriesContext';
import 'non.geist';
import 'non.geist/mono' // Если нужен моноширинный

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CategoriesProvider>
      <AccountsProvider>
        <TransactionProvider>
          <App />
        </TransactionProvider>
      </AccountsProvider>
    </CategoriesProvider>
  </React.StrictMode>,
);