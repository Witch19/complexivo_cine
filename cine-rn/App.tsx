import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MenuTypesScreen from "./src/screens/MenuTypesScreen";
import OrderEventsScreen from "./src/screens/OrderEventsScreen";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  MenuTypes: undefined;
  OrderEvents: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Menú" }} />
        <Stack.Screen name="MenuTypes" component={MenuTypesScreen} options={{ title: "Menu Vigente" }} />
        <Stack.Screen name="OrderEvents" component={OrderEventsScreen} options={{ title: "Order Events" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}