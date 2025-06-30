import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Blog from '../screens/Blog';
import Chat from '../screens/Chat';
import HomeScreen from '../screens/HomeScreen';
import Podcast from '../screens/Podcast';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

export default function RootStack() {
     const Stack = createNativeStackNavigator();

     return (
          <Tab.Navigator
               screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: '#111',
                    tabBarInactiveTintColor: '#bdbdbd',
                    tabBarStyle: {
                         backgroundColor: '#fff',
                         borderTopWidth: 0.5,
                         borderTopColor: '#ececec',
                         height: 60,
                         paddingBottom: 8,
                         shadowColor: '#000',
                         shadowOpacity: 0.04,
                         shadowRadius: 8,
                         elevation: 2,
                    },
                    tabBarLabelStyle: {
                         fontWeight: '600',
                         fontSize: 12,
                         marginBottom: 2,
                         letterSpacing: 0.2,
                    },
                    tabBarIcon: ({ color, focused }) => {
                         // Modern, beautiful MaterialCommunityIcons
                         if (route.name === 'Home') {
                              return <MaterialCommunityIcons name={focused ? 'home-variant' : 'home-variant-outline'} size={26} color={color} />;
                         }
                         if (route.name === 'Blog') {
                              return <MaterialCommunityIcons name={focused ? 'newspaper-variant' : 'newspaper-variant-outline'} size={25} color={color} />;
                         }
                         if (route.name === 'Chat AI') {
                              return <MaterialCommunityIcons name={focused ? 'message-text' : 'message-text-outline'} size={25} color={color} />;
                         }
                         if (route.name === 'Podcast') {
                              return <MaterialCommunityIcons name={focused ? 'microphone' : 'microphone-outline'} size={25} color={color} />;
                         }
                         if (route.name === 'Profile') {
                              return <MaterialCommunityIcons name={focused ? 'account-circle' : 'account-circle-outline'} size={27} color={color} />;
                         }
                    },
               })}
          >
               <Tab.Screen name='Home' component={HomeScreen} />
               <Tab.Screen name='Blog' component={Blog} />
               <Tab.Screen name='Chat AI' component={Chat} />
               <Tab.Screen name='Podcast' component={Podcast} />
               <Tab.Screen name='Profile' component={Profile} />
          </Tab.Navigator>
     );
}