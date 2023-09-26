import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainMenu from './components/MainMenu';
import MyData from './components/MyData';
import LogScreen from './components/LogScreen';
import Login from './components/Login';
import SignUp from './components/SignUp';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainMenu" component={MainMenu} options={{title: 'Welcome to Food Savings!'}}/>
        <Stack.Screen name="My Data" component={MyData} options={{title: 'Product Inventory'}}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Sign Up" component={SignUp}/>
        <Stack.Screen name="Inventory" component={LogScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
