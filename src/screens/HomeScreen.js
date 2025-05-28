import { useNavigation } from '@react-navigation/native'
import { View, Text, Button } from 'react-native'

export default function HomeScreen() {
     const navigation = useNavigation()

     const navigaFunc = () => {
          navigation.navigate('Detail')
     }

     return (
          <View>
               <Text>HomeScreen</Text>
               <Button
                    title='Go to Detail'
                    onPress={navigaFunc}
               />
          </View>
     )
}