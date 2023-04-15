import { createStackNavigator } from "@react-navigation/stack";
import CalendarScreen from "../screens/CalendarScreen";

const Stack = createStackNavigator();

const CalendarStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={"Main"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={CalendarScreen} />
    </Stack.Navigator>
  );
};

export default CalendarStackNavigator;
