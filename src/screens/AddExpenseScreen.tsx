import React, { useState } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import ExpenseForm from "../components/ExpenseForm";
import { getDBConnection, addExpense } from "../db/Database";

interface Props {
  navigation: any;
  route: any;
}

const AddExpenseScreen: React.FC<Props> = ({ navigation, route }) => {
  const { onRefresh } = route.params;
  const handleAddExpense = async (category: string, amount: number) => {
    if (!category || !amount) {
      Alert.alert("Error", "Please enter category and amount");
      return;
    }
    try {
      const db = await getDBConnection();
      await addExpense(db, category, amount);
      onRefresh(); 
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to add expense");
    }
  };

  return (
    <View style={styles.container}>
      <ExpenseForm onAdd={handleAddExpense} />
      <Button title="Cancel" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
});

export default AddExpenseScreen;
