import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen'
import Detail from '../screens/Detail'

export default function RootStack() {
     const Stack = createNativeStackNavigator()

     return (
          <Stack.Navigator>
               <Stack.Screen name='Home' component={HomeScreen} />
               <Stack.Screen name='Detail' component={Detail} />
          </Stack.Navigator>
     )
}