import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, Button, TouchableOpacity } from "react-native";
import { PieChart } from "react-native-chart-kit";
import ExpenseForm from "../components/ExpenseForm";
import { getDBConnection, createTable, addExpense, getExpenses } from "../db/Database";

interface Expense {
  id: number;
  category: string;
  amount: number;
}

export default function HomeScreen({ navigation }: any) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const loadData = async () => {
    const db = await getDBConnection();
    await createTable(db);
    const data = await getExpenses(db);
    setExpenses(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddExpense = async (category: string, amount: number) => {
    const db = await getDBConnection();
    await addExpense(db, category, amount);
    loadData();
  };

  // prepare data for chart
  const grouped = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const chartData = Object.keys(grouped).map((key, index) => ({
    name: key,
    amount: grouped[key],
    color: ["#f44336", "#2196f3", "#4caf50", "#ff9800", "#9c27b0"][index % 5],
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expense Tracker</Text>

      <ExpenseForm onAdd={handleAddExpense} />

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.category}: ₹{item.amount}</Text>
        )}
      />

      {chartData.length > 0 && (
        <PieChart
          data={chartData}
          width={Dimensions.get("window").width - 20}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="10"
        />
      )}

      <TouchableOpacity
        style={{ marginVertical: 10, backgroundColor: "#1976d2", padding: 10, borderRadius: 6 }}
        onPress={() => navigation.navigate("AddExpense", { onRefresh: loadData })}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Add Expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
