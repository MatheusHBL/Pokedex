import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
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

const typeTranslations = {
  normal: 'normal',
  fire: 'fogo',
  water: 'água',
  electric: 'elétrico',
  grass: 'planta',
  ice: 'gelo',
  fighting: 'lutador',
  poison: 'veneno',
  ground: 'terra',
  flying: 'voador',
  psychic: 'psíquico',
  bug: 'inseto',
  rock: 'pedra',
  ghost: 'fantasma',
  dragon: 'dragão',
  dark: 'sombrio',
  steel: 'metálico',
  fairy: 'fada',
};

const translations = {
  'About': 'Sobre',
  'Base Stats': 'Estatísticas',
  
  'Species': 'Espécie',
  'Height': 'Altura',
  'Weight': 'Peso',
  'Abilities': 'Habilidades',
  
  'Breeding': 'Reprodução',
  'Gender': 'Gênero',
  'Egg Groups': 'Grupos de Ovo',
  'Habitat': 'Habitat',
  
  'HP': 'HP',
  'Attack': 'Ataque',
  'Defense': 'Defesa',
  'Sp. Atk': 'Atq. Esp.',
  'Sp. Def': 'Def. Esp.',
  'Speed': 'Velocidade',
  'Total': 'Total',
  
  'Type defenses': 'Defesas de tipo',
  'The effectiveness of each type on': 'A efetividade de cada tipo contra',
  'Genderless': 'Sem gênero'
};

const abilityTranslations = {
  'overgrow': 'supercrescimento',
  'chlorophyll': 'clorofila',
  'blaze': 'chama',
  'solar-power': 'poder solar',
  'torrent': 'torrente',
  'rain-dish': 'coleta de chuva',
  'shield-dust': 'pó escudo',
  'static': 'estático',
  'lightning-rod': 'pára-raios',
  'intimidate': 'intimidação',
  'limber': 'flexível'
};

const habitatTranslations = {
  'cave': 'caverna',
  'forest': 'floresta',
  'grassland': 'campo',
  'mountain': 'montanha',
  'rare': 'raro',
  'rough-terrain': 'terreno acidentado',
  'sea': 'mar',
  'urban': 'urbano',
  'waters-edge': 'beira d\'água',
  'unknown': 'desconhecido'
};

const eggGroupTranslations = {
  'monster': 'monstro',
  'grass': 'planta',
  'bug': 'inseto',
  'flying': 'voador',
  'ground': 'terrestre',
  'fairy': 'fada',
  'humanoid': 'humanoide',
  'mineral': 'mineral',
  'water1': 'água 1',
  'water2': 'água 2',
  'water3': 'água 3',
  'amorphous': 'amorfo',
  'ditto': 'ditto',
  'dragon': 'dragão',
  'undiscovered': 'não descoberto'
};

const PokemonDetailScreen = ({ route, navigation }) => {
  const { pokemonId } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const [activeTab, setActiveTab] = useState('About');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();
        
        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();
        
        setPokemon({
          id: data.id,
          name: data.name,
          types: data.types.map(type => type.type.name),
          height: data.height / 10, // Converter para metros
          weight: data.weight / 10, // Converter para kg
          abilities: data.abilities.map(ability => ability.ability.name),
          stats: data.stats,
          image: data.sprites.other['official-artwork'].front_default,
          genderRate: speciesData.gender_rate,
          eggGroups: speciesData.egg_groups.map(group => group.name),
          habitat: speciesData.habitat ? speciesData.habitat.name : 'unknown',
        });
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar detalhes do pokémon:', error);
        setLoading(false);
      }
    };
    
    fetchPokemonDetails();
  }, [pokemonId]);
  
  if (loading || !pokemon) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B51" />
      </View>
    );
  }
  
  const mainType = pokemon.types[0];
  const backgroundColor = typeColors[mainType] || '#FFFFFF';
  
  const formatPokemonId = (id) => {
    return `#${id.toString().padStart(3, '0')}`;
  };
  
  const translateAbility = (ability) => {
    const translated = abilityTranslations[ability] || ability;
    return translated.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  const translateHabitat = (habitat) => {
    const translated = habitatTranslations[habitat] || habitat;
    return translated.charAt(0).toUpperCase() + translated.slice(1);
  };
  
  const translateEggGroup = (eggGroup) => {
    const translated = eggGroupTranslations[eggGroup] || eggGroup;
    return translated.charAt(0).toUpperCase() + translated.slice(1);
  };
  
  const renderContent = () => {
    switch (activeTab) {
      case 'About':
        return (
          <View style={styles.contentContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{translations['Species']}</Text>
              <Text style={styles.infoValue}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{translations['Height']}</Text>
              <Text style={styles.infoValue}>{pokemon.height.toFixed(1)}m ({(pokemon.height * 3.28).toFixed(1)} ft)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{translations['Weight']}</Text>
              <Text style={styles.infoValue}>{pokemon.weight.toFixed(1)}kg ({(pokemon.weight * 2.2).toFixed(1)} lbs)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{translations['Abilities']}</Text>
              <Text style={styles.infoValue}>
                {pokemon.abilities.map(ability => translateAbility(ability)).join(', ')}
              </Text>
            </View>
            
            <Text style={styles.sectionTitle}>{translations['Breeding']}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{translations['Gender']}</Text>
              <View style={styles.genderContainer}>
                <Text style={styles.genderText}>♂ {pokemon.genderRate === -1 ? translations['Genderless'] : `${(8 - pokemon.genderRate) / 8 * 100}%`}</Text>
                <Text style={styles.genderText}>♀ {pokemon.genderRate === -1 ? translations['Genderless'] : `${pokemon.genderRate / 8 * 100}%`}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{translations['Egg Groups']}</Text>
              <Text style={styles.infoValue}>
                {pokemon.eggGroups.map(group => translateEggGroup(group)).join(', ')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{translations['Habitat']}</Text>
              <Text style={styles.infoValue}>{translateHabitat(pokemon.habitat)}</Text>
            </View>
          </View>
        );
        
      case 'Base Stats':
        return (
          <View style={styles.contentContainer}>
            {pokemon.stats.map((stat, index) => {
              const statName = (() => {
                switch (stat.stat.name) {
                  case 'hp': return translations['HP'];
                  case 'attack': return translations['Attack'];
                  case 'defense': return translations['Defense'];
                  case 'special-attack': return translations['Sp. Atk'];
                  case 'special-defense': return translations['Sp. Def'];
                  case 'speed': return translations['Speed'];
                  default: return stat.stat.name;
                }
              })();
              
              const barColor = (() => {
                if (stat.base_stat < 50) return '#FF6B51';
                if (stat.base_stat < 80) return '#FFD84A';
                return '#8BD369';
              })();
              
              return (
                <View key={index} style={styles.statRow}>
                  <Text style={styles.statName}>{statName}</Text>
                  <Text style={styles.statValue}>{stat.base_stat}</Text>
                  <View style={styles.statBarContainer}>
                    <View 
                      style={[
                        styles.statBar, 
                        { 
                          width: `${Math.min(100, (stat.base_stat / 255) * 100)}%`,
                          backgroundColor: barColor
                        }
                      ]} 
                    />
                  </View>
                </View>
              );
            })}
            
            <View style={styles.statRow}>
              <Text style={styles.statName}>{translations['Total']}</Text>
              <Text style={styles.statValue}>
                {pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)}
              </Text>
            </View>
            
            <Text style={styles.sectionTitle}>{translations['Type defenses']}</Text>
            <Text style={styles.typeDefenseText}>
              {translations['The effectiveness of each type on']} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}.
            </Text>
          </View>
        );
        
      default:
        return null;
    }
  };
  
  const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.nameContainer}>
        <Text style={styles.pokemonName}>{pokemonName}</Text>
        <Text style={styles.pokemonId}>{formatPokemonId(pokemon.id)}</Text>
      </View>
      
      <View style={styles.typeContainer}>
        {pokemon.types.map((type, index) => (
          <View key={index} style={styles.typeTag}>
            <Text style={styles.typeText}>{typeTranslations[type] || type}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.imageContainer}>
        <Image source={{ uri: pokemon.image }} style={styles.pokemonImage} />
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.tabContainer}>
          {[
            {key: 'About', label: translations['About']}, 
            {key: 'Base Stats', label: translations['Base Stats']}, 
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text 
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <ScrollView style={styles.scrollContainer}>
          {renderContent()}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pokemonName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  pokemonId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  typeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  typeTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 10,
  },
  typeText: {
    color: 'white',
    fontWeight: '500',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
    zIndex: 1,
  },
  pokemonImage: {
    width: 200,
    height: 200,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingTop: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B51',
  },
  tabText: {
    color: '#AAAAAA',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  infoLabel: {
    width: 100,
    color: '#888888',
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    color: '#333333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  genderText: {
    color: '#333333',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statName: {
    width: 70,
    color: '#888888',
    fontWeight: '500',
  },
  statValue: {
    width: 40,
    textAlign: 'right',
    marginRight: 10,
    color: '#333333',
    fontWeight: 'bold',
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
  },
  typeDefenseText: {
    color: '#888888',
    marginBottom: 15,
  },
});

export default PokemonDetailScreen;