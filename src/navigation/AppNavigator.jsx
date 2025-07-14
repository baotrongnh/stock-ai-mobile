import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BlogDetail from '../screens/BlogDetail'
import Login from '../screens/Login'
import { RootStack } from './index'

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
     return (
          <NavigationContainer>
               <Stack.Navigator>
                    {/* <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} /> */}
                    <Stack.Screen name="Root" component={RootStack} options={{ headerShown: false }} />
                    <Stack.Screen name="BlogDetail" component={BlogDetail} />
               </Stack.Navigator>
          </NavigationContainer>
     )
}