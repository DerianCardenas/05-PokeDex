<script setup>
  import { onMounted, ref, watch } from 'vue';
  import router from 'vue-router'
  import Menu from './Menu.vue';
  import axios from 'axios'
  const showMenu = ref(false);
  const allPokemons = ref([]);
  const pokemonsList = ref([]);
  const offset = ref(0)
  const limit = ref(24)
  const getAllPokemon = async () => {
    const url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=1292"
    await axios.get(url).then(response => allPokemons.value = response.data.results)
    allPokemons.value.sort( (a, b) => a.id - b.id )
  }
  const toggleContent = () => {
    var left = document.getElementsByClassName("left-content")[0]
    var center = document.getElementsByClassName("center-content")[0]
    var right = document.getElementsByClassName("right-content")[0]
    var container = document.getElementsByClassName("container")[0]
    var pokedex = document.getElementsByClassName("pokedex-content")[0]
    setTimeout(() => {
      container.style.display = "none"
      pokedex.style.display = "flex"
    }, 600);
    center.style.display = "none"
    left.classList.add("salida-izquierda")
    right.classList.add("salida-derecha")
    getNextPokemon();
  }
  const getNextPokemon = async () => {
    pokemonsList.value = []
    const pokemonsToFetch = allPokemons.value.slice(offset.value, offset.value + limit.value)
    pokemonsToFetch.map( async pokemon => {
      await axios.get(pokemon.url).then(response => pokemonsList.value.push(response.data))
    })
    pokemonsList.value.sort( (a, b) => a.id - b.id )
  }
  const showPokemonData = (index) => {
    router.push(`/pokemon/${pokemonsList.value[index].id}`)
  }
  getAllPokemon()
</script>
<template>
    <Menu :show="showMenu"/>
    <div class="view-container">
      <div class="container">
        <div class="left-content">

        </div>
        <div class="center-content">
            <div class="center-circle">
                <div class="center-circle-2" @click="toggleContent">
                    
                </div>
            </div>
        </div>
        <div class="right-content">

        </div>
      </div>
      <div class="pokedex-content">
          <button @click="showMenu = !showMenu" class="btn-menu">MENU</button>
          <div class="pokemon-list">
              <div @click="showPokemonData(index)" class="pokemon-item" v-for="(pokemon, index) in pokemonsList" :key="index">
                  <img class="sprite" :src="pokemon.sprites.front_default"/> 
                  <p>{{pokemon.name}}</p>
              </div>
          </div>
      </div>
    </div>
  
</template>

<style scoped>
@import url('../styles/VistaPrincipal.css');
</style>
