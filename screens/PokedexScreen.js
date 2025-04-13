import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const typeColors = {
  normal: '#A8A77A',
  fire: '#FF6B51',
  water: '#56AEFF',
  electric: '#FFD84A',
  grass: '#8BD369',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

const PokedexScreen = ({ navigation }) => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon');
        const data = await response.json();
        
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonData = await pokemonResponse.json();
            
            return {
              id: pokemonData.id,
              name: pokemonData.name,
              types: pokemonData.types.map(type => type.type.name),
              image: pokemonData.sprites.other['official-artwork'].front_default,
            };
          })
        );
        
        setPokemonList(pokemonDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pokemon list:', error);
        setLoading(false);
      }
    };
    
    fetchPokemonList();
  }, []);
  
  const PokemonCard = ({ pokemon }) => {
    const mainType = pokemon.types[0];
    const backgroundColor = typeColors[mainType] || '#FFFFFF';
    
    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor }]}
        onPress={() => navigation.navigate('PokemonDetail', { pokemonId: pokemon.id })}
      >
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.pokemonName}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
            <View style={styles.typeContainer}>
              {pokemon.types.map((type, index) => (
                <View key={index} style={styles.typeTag}>
                  <Text style={styles.typeText}>{type}</Text>
                </View>
              ))}
            </View>
          </View>
          <Image 
            source={{ uri: pokemon.image }} 
            style={styles.pokemonImage} 
          />
        </View>
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokedex</Text>
        <TouchableOpacity>
          <Ionicons name="list" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B51" />
        </View>
      ) : (
        <FlatList
          data={pokemonList}
          renderItem={({ item }) => <PokemonCard pokemon={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
        />
      )}
      
      <View style={styles.floatingButton}>
        <Ionicons name="add" size={30} color="white" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    minHeight: 120,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pokemonName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  typeContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  typeTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  pokemonImage: {
    width: 70,
    height: 70,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4E74F2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default PokedexScreen;