import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  FAB,
  IconButton,
  Modal,
  Portal,
  ProgressBar,
  SegmentedButtons,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import CustomLineChart from "../components/CustomLineChart";
import { useFinance } from "../context/FinanceContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const pastelColors = ["#fff", "#222"];

const GoalsScreen = () => {
  const { goals, addGoal, deleteGoal, updateGoal } = useFinance();
  const [visible, setVisible] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [savingFrequency, setSavingFrequency] = useState("monthly");
  const [editMode, setEditMode] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [periodType, setPeriodType] = useState("months");
  const [periodCount, setPeriodCount] = useState(1);

  const showModal = () => {
    setEditMode(false);
    setGoalName("");
    setTargetAmount("");
    setCurrentAmount("");
    setSavingFrequency("monthly");
    setPeriodType("months");
    setPeriodCount(1);
    setVisible(true);
  };
  const hideModal = () => setVisible(false);

  const handleAddGoal = async () => {
    if (goalName && targetAmount && currentAmount && periodCount > 0) {
      const newGoal = {
        id: Date.now().toString(),
        name: goalName,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount),
        savingFrequency,
        periodType,
        periodCount,
        date: new Date().toISOString(),
      };
      await addGoal(newGoal);
      setGoalName("");
      setTargetAmount("");
      setCurrentAmount("");
      setSavingFrequency("monthly");
      setPeriodType("months");
      setPeriodCount(1);
      hideModal();
    }
  };

  const handleEditGoal = (goal) => {
    setEditMode(true);
    setEditingGoalId(goal.id);
    setGoalName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setSavingFrequency(goal.savingFrequency);
    setPeriodType(goal.periodType || "months");
    setPeriodCount(goal.periodCount || 1);
    setVisible(true);
  };

  const handleUpdateGoal = async () => {
    if (
      editingGoalId &&
      goalName &&
      targetAmount &&
      currentAmount &&
      periodCount > 0
    ) {
      const updatedGoal = {
        id: editingGoalId,
        name: goalName,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount),
        savingFrequency,
        periodType,
        periodCount,
        date: new Date().toISOString(),
      };
      await updateGoal(updatedGoal);
      setEditingGoalId(null);
      setEditMode(false);
      setGoalName("");
      setTargetAmount("");
      setCurrentAmount("");
      setSavingFrequency("monthly");
      setPeriodType("months");
      setPeriodCount(1);
      hideModal();
    }
  };

  const handleDeleteGoal = async (id) => {
    await deleteGoal(id);
  };

  const calculateProgress = (current, target) => {
    return Math.min(current / target, 1);
  };

  const calculateEMI = (target, current, periodType, periodCount) => {
    const remaining = target - current;
    let emi = 0;
    if (periodType === "days") emi = remaining / periodCount;
    else if (periodType === "months") emi = remaining / periodCount;
    else if (periodType === "years") emi = remaining / periodCount;
    return emi;
  };

  const generateProgressData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const data = months.map((_, index) => {
      const monthGoals = goals.filter((goal) => {
        const goalDate = new Date(goal.date);
        return goalDate.getMonth() === index;
      });
      return monthGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    });

    return {
      labels: months,
      datasets: [{ data }],
    };
  };

  const progressData = generateProgressData();

  const GoalCard = ({ goal, i }) => {
    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
    const emi = calculateEMI(
      goal.targetAmount,
      goal.currentAmount,
      goal.periodType || "months",
      goal.periodCount || 1
    );
    return (
      <Surface
        style={[
          styles.goalCard,
          { backgroundColor: pastelColors[i % 2 == 0 ? 0 : 1] },
        ]}
      >
        <View style={styles.goalHeader}>
          <View style={styles.goalInfo}>
            <Text
              style={[
                styles.goalName,
                { color: pastelColors[i % 2 == 0 ? 1 : 0] },
              ]}
            >
              {goal.name}
            </Text>
            <Text
              style={[
                styles.goalDate,
                { color: pastelColors[i % 2 == 0 ? 1 : 0] },
              ]}
            >
              {new Date(goal.date).toLocaleDateString()}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 0,
              position: "absolute",
              right: -20,
              top: -13,
            }}
          >
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => handleEditGoal(goal)}
              style={styles.editBtn}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDeleteGoal(goal.id)}
              style={styles.deleteBtn}
            />
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text
              style={[
                styles.progressText,
                { color: pastelColors[i % 2 == 0 ? 1 : 0] },
              ]}
            >
              ₹{goal.currentAmount.toFixed(2)} / ₹{goal.targetAmount.toFixed(2)}
            </Text>
            <Text
              style={[
                styles.progressPercentage,
                { color: pastelColors[i % 2 == 0 ? 1 : 0] },
              ]}
            >
              {(progress * 100).toFixed(1)}%
            </Text>
          </View>
          <ProgressBar
            progress={progress}
            color={i % 2 == 0 ? "#222" : "#fff"}
            style={styles.progressBar}
          />
        </View>
        <View style={styles.savingInfo}>
          <Text
            style={[
              styles.savingText,
              { color: pastelColors[i % 2 == 0 ? 1 : 0] },
            ]}
          >
            ₹{emi.toFixed(2)} per {goal.periodType || "month"} (for{" "}
            {goal.periodCount || 1} {goal.periodType || "month"})
          </Text>
        </View>
      </Surface>
    );
  };

  return (
    <View style={styles.screenBg}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Savings Goals</Text>

        {goals.length > 0 && (
          <>
            <View style={styles.chartBox}>
              <Text style={styles.sectionTitle}>Savings Trends</Text>
              <CustomLineChart chartData={progressData} />
            </View>
            <Text style={styles.sectionTitle}>Your Goals</Text>
            <View style={styles.goalsRow}>
              {goals.map((goal, i) => (
                <GoalCard key={goal.id} goal={goal} i={i} />
              ))}
            </View>
          </>
        )}
        {goals.length === 0 && (
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
            <Text style={styles.noDataText}>No goals set yet</Text>
          </View>
        )}
      </ScrollView>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={[styles.modal, { backgroundColor: "#fff" }]}
        >
          <Text style={styles.modalTitle}>
            {editMode ? "Edit Goal" : "Add Savings Goal"}
          </Text>
          <TextInput
            label="Goal Name"
            value={goalName}
            onChangeText={setGoalName}
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
            label="Target Amount"
            value={targetAmount}
            onChangeText={setTargetAmount}
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
          <TextInput
            label="Current Amount"
            value={currentAmount}
            onChangeText={setCurrentAmount}
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
          <Text style={styles.frequencyLabel}>Goal Period</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <SegmentedButtons
              value={periodType}
              onValueChange={setPeriodType}
              buttons={[
                {
                  value: "days",
                  label: "Days",
                  style: {
                    backgroundColor: periodType === "days" ? "#222" : "white",
                  },
                  labelStyle: {
                    color: periodType === "days" ? "white" : "#222",
                  },
                },
                {
                  value: "months",
                  label: "Months",
                  style: {
                    backgroundColor: periodType === "months" ? "#222" : "white",
                    minWidth: 85,
                  },
                  labelStyle: {
                    color: periodType === "months" ? "white" : "#222",
                  },
                },
                {
                  value: "years",
                  label: "Years",
                  style: {
                    backgroundColor: periodType === "years" ? "#222" : "white",
                  },
                  labelStyle: {
                    color: periodType === "years" ? "white" : "#222",
                  },
                },
              ]}
              style={{ flex: 1, marginRight: 8 }}
            />
            <TextInput
              label="Count"
              value={String(periodCount)}
              onChangeText={(text) =>
                setPeriodCount(Number(text.replace(/[^0-9]/g, "")))
              }
              keyboardType="numeric"
              style={{
                width: 63,
                height: 38,
                marginBottom: 5,
                backgroundColor: "#fff",
              }}
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
          </View>
          <Button
            mode="contained"
            onPress={editMode ? handleUpdateGoal : handleAddGoal}
            style={styles.button}
            buttonColor="#222"
            textColor="#fff"
          >
            {editMode ? "Update Goal" : "Add Goal"}
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
  goalsRow: {
    marginBottom: 50,
  },
  goalCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    marginRight: 8,
    minWidth: 180,
    elevation: 2,
    position: "relative",
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  goalDate: {
    color: "#666",
    fontSize: 13,
    marginBottom: 4,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressText: {
    color: "#222",
    fontSize: 14,
  },
  progressPercentage: {
    fontWeight: "bold",
    color: "#885AFF",
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "grey",
  },
  savingInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  savingText: {
    marginLeft: 8,
    opacity: 0.7,
    color: "#222",
    fontSize: 13,
  },
  editBtn: {
    borderRadius: 16,
    elevation: 2,
    marginRight: -10,
  },
  deleteBtn: {
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
  },
  frequencyLabel: {
    marginBottom: 8,
    opacity: 0.7,
    color: "#222",
  },
  segmentedButtons: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#222",
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
    elevation: 6,
  },
});

export default GoalsScreen;
