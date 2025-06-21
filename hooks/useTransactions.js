import { useCallback, useState } from "react";
import { Alert } from "react-native";

import {API_URL} from "@/constants/api.js"

export const useTransactions = (userId) => {

  console.log("Hi", userId)
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0
  });
  const [isloading, setIsloading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.log("Error fetching transactions: ", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();

      setSummary(data);
    } catch (error) {
      console.log("Error fetching summary: ", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsloading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.log("Error loading data: ", error);
    } finally {
      setIsloading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete Transaction.");

      loadData();
      Alert.alert("Success", "Transaction deleted Successfully");
    } catch (error) {
      console.log("Error deleting transaction: ", error);
      Alert.alert("Error", error.message);
    }
  };

  return { transactions, summary, isloading, loadData, deleteTransaction };

};