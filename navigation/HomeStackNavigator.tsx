import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import MyAccountScreen from "../screens/MyAccountScreen";

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={"Main"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={HomeScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="MyAccount" component={MyAccountScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
