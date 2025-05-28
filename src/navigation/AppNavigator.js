import { NavigationContainer } from '@react-navigation/native'
import { RootStack } from './index'

export default function AppNavigator() {
     return (
          <NavigationContainer>
               <RootStack />
          </NavigationContainer>
     )
}