import { useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { FinanceProvider } from "./src/context/FinanceContext";
import AppNavigator from "./src/navigation/AppNavigator";
import SplashScreen from "./src/screens/SplashScreen";

export default function App() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  const handleSplashFinish = () => {
    setIsSplashComplete(true);
  };

  if (!isSplashComplete) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <PaperProvider>
      <FinanceProvider>
        <AppNavigator />
      </FinanceProvider>
    </PaperProvider>
  );
}