import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, IconButton, Modal, Portal, Surface, Text, TextInput } from "react-native-paper";
import CustomLineChart from "../components/CustomLineChart";
import { useFinance } from "../context/FinanceContext";

const DashboardScreen = () => {
  const { balance, expenses, goals, setBalance, user } = useFinance();
  const [visible, setVisible] = useState(false);
  const [newBalance, setNewBalance] = useState("");

  const showModal = () => {
    setNewBalance(balance.toString());
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setNewBalance("");
  };

  const handleUpdateBalance = async () => {
    if (newBalance) {
      await setBalance(Number(newBalance));
      hideModal();
    }
  };

  const totalSavings = goals.reduce(
    (sum, goal) => sum + (goal.currentAmount || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const savingsData = months.map((_, idx) => {
    const monthGoals = goals.filter((goal) => {
      const goalDate = new Date(goal.date);
      return goalDate.getMonth() === idx;
    });
    return monthGoals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0);
  });

  const chartData = {
    labels: months,
    datasets: [
      {
        data: savingsData,
        color: (opacity = 1) => "rgba(136, 58, 255, 1)",
        strokeWidth: 3,
      },
    ],
  };
  
  return (
    <View style={styles.screenBg}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Welcome Back</Text>
          <Text style={styles.greeting}>
            Hello{user?.name ? `, ${user.name}` : ""} 👋
          </Text>
        </View>

        <Surface style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.cardLabel}>Your Balance</Text>
            <IconButton
              icon="pencil"
              size={20}
              onPress={showModal}
              style={styles.editBtn}
              iconColor="#fff"
            />
          </View>
          <Text style={styles.balanceText}>
            ₹{balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </Text>
        </Surface>

        <View style={styles.chartBox}>
          <Text style={styles.sectionTitle}>Savings Trends</Text>
          <CustomLineChart chartData={chartData} />
        </View>

        <View style={styles.summaryRow}>
          <Surface style={[styles.summaryCard, { backgroundColor: "#fff" }]}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryValue}>
              ₹
              {totalExpenses.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Text>
          </Surface>
          <Surface style={[styles.summaryCard, { backgroundColor: "#222" }]}>
            <Text style={[styles.summaryLabel, { color: "#fff" }]}>
              Total Savings
            </Text>
            <Text style={[styles.summaryValue, { color: "#fff" }]}>
              ₹
              {totalSavings.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Text>
          </Surface>
        </View>
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={[styles.modal, { backgroundColor: "#fff" }]}
        >
          <Text style={styles.modalTitle}>Edit Balance</Text>
          <TextInput
            label="New Balance"
            value={newBalance}
            onChangeText={setNewBalance}
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
          <Button
            mode="contained"
            onPress={handleUpdateBalance}
            style={styles.button}
            buttonColor="#222"
            textColor="#fff"
          >
            Update Balance
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenBg: {
    flex: 1,
    backgroundColor: "#F7F7FA",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
    paddingTop: 50,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 28,
    color: "#222",
    marginBottom: 4,
    marginLeft: 4,
  },
  greeting: {
    fontSize: 16,
    color: "#666",
    marginLeft: 4,
  },
  balanceCard: {
    backgroundColor: "#222",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardLabel: {
    color: "#fff",
    fontSize: 16,
  },
  balanceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 32,
    marginBottom: 8,
  },
  editBtn: {
    margin: 0,
    marginRight: -8,
  },
  segmented: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "#F0F0F5",
    padding: 4,
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
  paymentsRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  paymentCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    marginRight: 8,
    minWidth: 140,
    elevation: 2,
    position: "relative",
  },
  paymentName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  paymentDate: {
    color: "#666",
    fontSize: 13,
    marginBottom: 8,
  },
  paymentAmount: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 4,
    color: "#885AFF",
  },
  noDataText: {
    color: "#B0B0B0",
    fontSize: 16,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
    marginTop: 20,
    justifyContent: "space-between",
  },
  summaryCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    minWidth: 140,
    alignItems: "center",
  },
  summaryLabel: {
    color: "#666",
    fontSize: 15,
    marginBottom: 4,
  },
  summaryValue: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#222",
  },
  valuePill: {
    backgroundColor: "#222",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: "center",
    marginBottom: 4,
  },
  valuePillText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
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
});

export default DashboardScreen;
