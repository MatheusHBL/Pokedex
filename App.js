import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PokedexScreen from './screens/PokedexScreen';
import PokemonDetailScreen from './screens/PokemonDetailScreen';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Pokedex">
        <Stack.Screen 
          name="Pokedex" 
          component={PokedexScreen} 
          options={{ 
            headerShown: false // Escondemos o cabeçalho padrão para personalizar nosso próprio
          }} 
        />
        <Stack.Screen 
          name="PokemonDetail" 
          component={PokemonDetailScreen} 
          options={{ 
            headerShown: false // Escondemos o cabeçalho padrão para personalizar nosso próprio
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}