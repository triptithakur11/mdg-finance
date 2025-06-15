import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Chip,
  FAB,
  IconButton,
  Menu,
  Modal,
  Portal,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import ExpenseBarChart from "../components/ExpenseBarChart";
import { useFinance } from "../context/FinanceContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const pastelColors = ["#fff", "#222"];

const ExpenditureScreen = () => {
  const { expenses, addExpense, deleteExpense } = useFinance();
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [menuVisible, setMenuVisible] = useState(false);

  const categories = [
    "Home",
    "Kitchen",
    "Sports",
    "Education",
    "Travel",
    "Electricity",
    "Medical",
    "Others",
  ];

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setName("");
    setAmount("");
    setCategory("");
  };

  const handleAddExpense = async () => {
    if (name && amount && category) {
      const newExpense = {
        id: Date.now().toString(),
        name,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString(),
      };
      await addExpense(newExpense);
      setName("");
      setAmount("");
      setCategory("");
      hideModal();
    }
  };

  const handleDeleteExpense = async (id) => {
    await deleteExpense(id);
  };

  const filterExpensesByTimeFrame = (expenses) => {
    const now = new Date();
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      switch (timeFrame) {
        case "daily":
          return expenseDate.toDateString() === now.toDateString();
        case "monthly":
          return (
            expenseDate.getMonth() === now.getMonth() &&
            expenseDate.getFullYear() === now.getFullYear()
          );
        case "yearly":
          return expenseDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const filteredExpenses = filterExpensesByTimeFrame(expenses);

  return (
    <View style={styles.screenBg}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Expenditure</Text>
        <View style={styles.timeFrameContainer}>
          <Chip
            onPress={() => setTimeFrame("daily")}
            style={[
              styles.timeFrameChip,
              timeFrame === "daily" && { backgroundColor: "#222" },
            ]}
            textStyle={
              timeFrame === "daily" ? { color: "#fff" } : { color: "#222" }
            }
          >
            Daily
          </Chip>
          <Chip
            onPress={() => setTimeFrame("monthly")}
            style={[
              styles.timeFrameChip,
              timeFrame === "monthly" && { backgroundColor: "#222" },
            ]}
            textStyle={
              timeFrame === "monthly" ? { color: "#fff" } : { color: "#222" }
            }
          >
            Monthly
          </Chip>
          <Chip
            onPress={() => setTimeFrame("yearly")}
            style={[
              styles.timeFrameChip,
              timeFrame === "yearly" && { backgroundColor: "#222" },
            ]}
            textStyle={
              timeFrame === "yearly" ? { color: "#fff" } : { color: "#222" }
            }
          >
            Yearly
          </Chip>
        </View>

        {filteredExpenses.length > 0 && (
          <>
            <View style={styles.chartBox}>
              <Text style={styles.sectionTitle}>Expense Distribution</Text>
              <ExpenseBarChart chartData={filteredExpenses} />
            </View>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            <View style={styles.expensesRow}>
              {filteredExpenses.map((expense, i) => (
                <Surface
                  key={expense.id}
                  style={[
                    styles.expenseCard,
                    { backgroundColor: pastelColors[i % pastelColors.length] },
                  ]}
                >
                  <Text
                    style={[
                      styles.expenseName,
                      { color: pastelColors[i % 2 == 0 ? 1 : 0] },
                    ]}
                  >
                    {expense.name}
                  </Text>
                  <Text
                    style={[
                      styles.expenseDate,
                      { color: pastelColors[i % 2 == 0 ? 1 : 0] },
                    ]}
                  >
                    {new Date(expense.date).toLocaleDateString()}
                  </Text>
                  <Text
                    style={[
                      styles.expenseCategory,
                      { color: pastelColors[i % 2 == 0 ? 1 : 0] },
                    ]}
                  >
                    Category: {expense.category}
                  </Text>
                  <Text
                    style={[
                      styles.expenseAmount,
                      { color: pastelColors[i % 2 == 0 ? 1 : 0] },
                    ]}
                  >
                    ₹{expense.amount?.toFixed(2)}
                  </Text>
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => handleDeleteExpense(expense.id)}
                    style={styles.deleteBtn}
                  />
                </Surface>
              ))}
            </View>
          </>
        )}

        {filteredExpenses.length === 0 && (
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 200,
            }}
          >
            <MaterialCommunityIcons
              name="timer-sand-empty"
              size={50}
              color="#222"
            />
            <Text style={styles.noDataText}>No expenses for this period</Text>
          </View>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={[styles.modal, { backgroundColor: "#fff" }]}
        >
          <Text style={styles.modalTitle}>Add Expense</Text>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                text: "#222",
                primary: "#222",
                onSurface: "#222",
                placeholder: "#222",
              },
            }}
          />
          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            theme={{
              colors: {
                text: "#222",
                primary: "#222",
                onSurface: "#222",
                placeholder: "#222",
              },
            }}
          />
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.categoryButton}
                textColor="#222"
              >
                {category || "Select Category"}
              </Button>
            }
            contentStyle={{ backgroundColor: "#fff" }}
          >
            {categories.map((cat) => (
              <Menu.Item
                key={cat}
                onPress={() => {
                  setCategory(cat);
                  setMenuVisible(false);
                }}
                title={cat}
                titleStyle={{ color: "#222" }}
              />
            ))}
          </Menu>

          <Button
            mode="contained"
            onPress={handleAddExpense}
            style={styles.button}
            buttonColor="#222"
            textColor="#fff"
          >
            Add Expense
          </Button>
        </Modal>
      </Portal>

      <FAB icon="plus" color={"#222"} style={styles.fab} onPress={showModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  screenBg: {
    flex: 1,
    backgroundColor: "#F7F7FA",
    paddingTop: 50,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#222",
    marginBottom: 24,
    marginLeft: 4,
  },
  timeFrameContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    marginLeft: 4,
  },
  timeFrameChip: {
    marginRight: 8,
    borderRadius: 16,
    paddingHorizontal: 13,
    backgroundColor: "grey",
    color: "#222",
  },
  chartBox: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 12,
    marginBottom: 24,
    elevation: 2,
  },
  chart: {
    borderRadius: 24,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#222",
    marginBottom: 12,
    marginLeft: 4,
  },
  expensesRow: {
    marginBottom: 50,
  },
  expenseCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    marginRight: 8,
    minWidth: 140,
    elevation: 2,
    position: "relative",
    marginBottom: 16,
  },
  expenseName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  expenseDate: {
    color: "#666",
    fontSize: 13,
    marginBottom: 4,
  },
  expenseCategory: {
    color: "#885AFF",
    fontSize: 13,
    marginBottom: 8,
  },
  expenseAmount: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 4,
    color: "#885AFF",
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 16,
    elevation: 2,
  },
  noDataText: {
    color: "#B0B0B0",
    fontSize: 16,
    marginTop: 8,
  },
  modal: {
    padding: 20,
    margin: 20,
    borderRadius: 20,
    elevation: 4,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 16,
    color: "#222",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
    color: "#222",
  },
  button: {
    marginTop: 16,
    borderRadius: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 100,
    backgroundColor: "#fff",
    color: "#222",
    elevation: 6,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222",
  },
  chartContainer: {
    height: 200,
    marginTop: 16,
  },
  categoryButton: {
    marginBottom: 16,
    color: "#222",
  },
});

export default ExpenditureScreen;
