import { NavigationContainer } from '@react-navigation/native'
import { RootStack } from './index'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BlogDetail from '../screens/BlogDetail'
import { Text } from 'react-native'

const Stack = createNativeStackNavigator()

export default function AppNavigator() {
     return (
          <NavigationContainer>
               <Stack.Navigator>
                    <Stack.Screen name="Root" component={RootStack} options={{ headerShown: false }} />
                    <Stack.Screen name="BlogDetail" component={BlogDetail} />
               </Stack.Navigator>
          </NavigationContainer>
     )
}