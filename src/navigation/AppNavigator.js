import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import AccountScreen from "../screens/AccountScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ExpenditureScreen from "../screens/ExpenditureScreen";
import GoalsScreen from "../screens/GoalsScreen";

const Tab = createBottomTabNavigator();

const pastel = {
  white: "#fff",
  purple: "#885AFF",
  gray: "#B0B0B0",
  bg: "#F7F7FA",
};

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        let iconName = "circle";
        if (route.name === "Dashboard") iconName = "view-dashboard";
        if (route.name === "Expenditure") iconName = "wallet-travel";
        if (route.name === "Goals") iconName = "trophy-outline";
        if (route.name === "Account") iconName = "account";

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconWrapper,
                isFocused && styles.activeIconWrapper,
              ]}
            >
              <MaterialCommunityIcons
                name={iconName}
                size={28}
                color={isFocused ? pastel.white : pastel.gray}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Expenditure" component={ExpenditureScreen} />
        <Tab.Screen name="Goals" component={GoalsScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: pastel.white,
    borderRadius: 32,
    padding: 10,
    marginHorizontal: 24,
    marginBottom: Platform.OS === "ios" ? 32 : 16,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: "transparent",
    borderRadius: 50,
    padding: 8,
    marginBottom: 2,
  },
  activeIconWrapper: {
    backgroundColor: "#222",
    borderRadius: 50,
  },
});

export default AppNavigator;
