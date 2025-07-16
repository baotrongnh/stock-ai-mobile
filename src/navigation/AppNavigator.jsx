import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BlogDetail from "../screens/BlogDetail";
import PodcastDetail from "../screens/PodcastDetail";
import { RootStack } from "./index";
import Login from "../screens/Login";
import CreatePost from "../screens/CreatePost";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Root" component={RootStack} options={{ headerShown: false }} />
        <Stack.Screen name="BlogDetail" component={BlogDetail} options={{ headerShown: false }} />
        <Stack.Screen name="PodcastDetail" component={PodcastDetail} options={{ headerShown: false }} />
        <Stack.Screen name="CreatePost" component={CreatePost} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
