import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import HomeScreen from '../Components/HomeScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import PasswordScreen from '../Screens/PasswordScreen';
import EditProfileScreen from '../Screens/EditProfileScreen';
import StatisticsScreen from '../Screens/StatisticScreen';
import ActivityScreen from '../Screens/ActivityScreen';

const Tabs = AnimatedTabBarNavigator()

const TabBarIcon = props => {
	return (
		<Icon
			name={props.name}
			size={props.size ? props.size : 24}
			color={props.tintColor}
		/>
	)
}

export default () => (
	<Tabs.Navigator initialRouteName="Home"
        tabBarOptions={{
            activeTintColor: '#fff',
            inactiveTintColor: '#fff',
            activeBackgroundColor: '#44caac', //#9257AA
        }}
        appearence={{
            tabBarBackground: '#000', //'#201f23'
            activeColor: '#fff',
            dotCornerRadius: 44,
            // floating: true,
            topPadding: 22,
            bottomPadding: 22,
        }}
    >
		<Tabs.Screen
			name="Home"
			component={StackHome}
			options={{
				tabBarIcon: ({ focused, color }) => (
					<TabBarIcon
						focused={focused}
						tintColor={color}
						name="grid"
					/>
				),
			}}
		/>
		<Tabs.Screen
			name="Activity"
			component={StackActivity}
			options={{
				tabBarIcon: ({ focused, color, size }) => (
					<TabBarIcon
						focused={focused}
						tintColor={color}
						name="activity"
					/>
				),
			}}
		/>
		<Tabs.Screen
			name="Diary"
			component={StackStatistic}
			options={{
				tabBarIcon: ({ focused, color }) => (
					<TabBarIcon
						focused={focused}
						tintColor={color}
						name="calendar"
					/>
				),
			}}
		/>
		<Tabs.Screen
			name="Profile"
			component={StackProfile}
			options={{
				tabBarIcon: ({ focused, color }) => (
					<TabBarIcon
						focused={focused}
						tintColor={color}
						name="user"
					/>
				),
			}}
		/>
	</Tabs.Navigator>
)

const HomeStack = createStackNavigator()

function StackHome({ navigation }) {
    return (
        <HomeStack.Navigator initialRouteName="Home">
            <HomeStack.Screen name="Home" component={HomeScreen}
                options={{
                    headerShown: false,
                }}
            />
        </HomeStack.Navigator>
    )
}

const ActivityStack = createStackNavigator()

function StackActivity({ navigation, route }) {
    // I can try but error =.=
    // if (route.state && route.state.routeNames[route.state.index] === "Running") {
    //     navigation.setOptions({tabBarVisible: false})
    // } else {
    //     navigation.setOptions({tabBarVisible: true})
    // }
    return (
        <ActivityStack.Navigator initialRouteName="Activity">
            <ActivityStack.Screen name="Activity" component={ActivityScreen}
                options={{
                    headerShown: false,
                }}
            />
            {/* <ActivityStack.Screen name="EndActivity" component={EndActivityScreen}
                options={{
                    headerShown: true,
                }}
            /> */}
            {/* <ActivityStack.Screen name="Running" component={RunScreen}
                options={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: "#e1e6ea",
                    },
                    headerTitleStyle: { color: '#434c73' },
                    headerTitleAlign: "center",
                    headerTintColor: '#434c73',
                    tabBarVisible: false,
                }}
            /> */}
        </ActivityStack.Navigator>
        
    )
}

const StatisticStack = createStackNavigator()

function StackStatistic({ navigation }) {
    return (
        <StatisticStack.Navigator initialRouteName="Statistics">
            <StatisticStack.Screen name="Statistics" component={StatisticsScreen}
                options={{
                    headerShown: false,
                }}
            />
        </StatisticStack.Navigator>
    )
}

const ProfileStack = createStackNavigator()

function StackProfile({ navigation }) {
    return (
        <ProfileStack.Navigator initialRouteName="Profile">
            <ProfileStack.Screen name="Profile" component={ProfileScreen}
                options={{
                    headerShown: false
                }}
            />
            <ProfileStack.Screen name="EditProfile" component={EditProfileScreen}
                options={{
                    headerStyle: {
                        backgroundColor: "#e1e6ea",
                    },
                    headerTitleStyle: { color: '#434c73' },
                    headerTitleAlign: "center",
                    headerTintColor: '#434c73',
                }}
            />
            <ProfileStack.Screen name="ChangePassword" component={PasswordScreen}
                options={{
                    headerStyle: {
                        backgroundColor: "#e1e6ea",
                    },
                    headerTitleStyle: { color: '#434c73' },
                    headerTitleAlign: "center",
                    headerTintColor: '#434c73',
                }}
            />
        </ProfileStack.Navigator>
    )
}

const styles = StyleSheet.create({

})
