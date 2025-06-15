import AsyncStorage from '@react-native-async-storage/async-storage';
import  { createContext, useContext, useEffect, useState } from 'react';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState({
    name: "",
    profession: "",
    avatar: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [balanceData, expensesData, goalsData, userData] = await Promise.all([
        AsyncStorage.getItem("balance"),
        AsyncStorage.getItem("expenses"),
        AsyncStorage.getItem("goals"),
        AsyncStorage.getItem("user"),
      ]);

      if (balanceData) setBalance(parseFloat(balanceData));
      if (expensesData) setExpenses(JSON.parse(expensesData));
      if (goalsData) setGoals(JSON.parse(goalsData));
      if (userData) setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const saveExpenses = async (newExpenses) => {
    try {
      await AsyncStorage.setItem('expenses', JSON.stringify(newExpenses));
      setExpenses(newExpenses);
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  };

  const saveGoals = async (newGoals) => {
    try {
      await AsyncStorage.setItem('goals', JSON.stringify(newGoals));
      setGoals(newGoals);
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const saveBalance = async (newBalance) => {
    try {
      await AsyncStorage.setItem('balance', String(newBalance));
      setBalance(newBalance);
    } catch (error) {
      console.error('Error saving balance:', error);
    }
  };

  const addExpense = async (expense) => {
    try {
      const newExpenses = [...expenses, expense];
      setExpenses(newExpenses);
      await saveExpenses(newExpenses);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const newExpenses = expenses.filter((expense) => expense.id !== id);
      setExpenses(newExpenses);
      await saveExpenses(newExpenses);
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const addGoal = async (goal) => {
    try {
      const newGoals = [...goals, goal];
      setGoals(newGoals);
      await saveGoals(newGoals);
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      const newGoals = goals.filter((goal) => goal.id !== id);
      setGoals(newGoals);
      await saveGoals(newGoals);
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const updateGoal = async (updatedGoal) => {
    try {
      const newGoals = goals.map((goal) =>
        goal.id === updatedGoal.id ? updatedGoal : goal
      );
      setGoals(newGoals);
      await saveGoals(newGoals);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const updateUser = async (userData) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const value = {
    expenses,
    goals,
    balance,
    setBalance: saveBalance,
    addExpense,
    deleteExpense,
    addGoal,
    deleteGoal,
    updateGoal,
    user,
    updateUser,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}; 