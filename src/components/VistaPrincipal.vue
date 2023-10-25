<script setup>
  import 'sweetalert2/dist/sweetalert2.min.css';
  import { onMounted, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import Menu from './Menu.vue';
  import axios from 'axios'
  import Swal from "sweetalert2/dist/sweetalert2";
  const showMenu = ref(false);
  const router = useRouter();
  const pokemon = ref("");
  const allPokemons = ref([]);
  const pokemonsList = ref([]);
  const offset = ref(0)
  const limit = ref(18)
  const getAllPokemon = async () => {
    const url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=1292"
    await axios.get(url).then(response => allPokemons.value = response.data.results)
    ordenarArreglo();
  }
  const toggleContent = () => {
    var left = document.getElementsByClassName("left-content")[0]
    var center = document.getElementsByClassName("center-content")[0]
    var right = document.getElementsByClassName("right-content")[0]
    var container = document.getElementsByClassName("container")[0]
    var pokedex = document.getElementsByClassName("pokedex-content")[0]
    setTimeout(() => {
      container.style.display = "none"
      pokedex.style.display = "block"
    }, 600);
    center.style.display = "none"
    left.classList.add("salida-izquierda")
    right.classList.add("salida-derecha")
    getFirstPokemon();
  }
  const getFirstPokemon = async () => {
    pokemonsList.value = []
    const pokemonsToFetch = allPokemons.value.slice(offset.value, offset.value + limit.value)
    pokemonsToFetch.map( async pokemon => {
      await axios.get(pokemon.url).then(response => pokemonsList.value.push(response.data))
    })
    ordenarArreglo();
  }
  const getNextPokemon = async () => {
    pokemonsList.value = []
    offset.value == limit.value * (allPokemons.value.length / limit.value).toFixed(0) - limit.value ?
      offset.value = 0 :
      offset.value += limit.value
    const pokemonsToFetch = allPokemons.value.slice(offset.value, offset.value + limit.value)
    pokemonsToFetch.map( async pokemon => {
      await axios.get(pokemon.url).then(response => pokemonsList.value.push(response.data))
    })
    ordenarArreglo();
  }
  const getPrevPokemon = async () => {
    pokemonsList.value = []
    offset.value != 0 ? offset.value -= limit.value : offset.value = limit.value * (allPokemons.value.length / limit.value).toFixed(0) - limit.value
    const pokemonsToFetch = allPokemons.value.slice(offset.value, offset.value + limit.value)
    pokemonsToFetch.map( async pokemon => {
      await axios.get(pokemon.url).then(response => pokemonsList.value.push(response.data))
    })
    ordenarArreglo();
  }
  const showPokemonData = (index) => {
    router.push(`/pokemon/${pokemonsList.value[index].id}`)
  }
  const searchPokemon = () => {
    if(pokemon.value != ""){
      const results  = allPokemons.value.filter(item => 
        item.name.toLowerCase().includes(pokemon.value.toLowerCase()))
      console.log(results);
      if(results.length == 1){
        var id = results[0].url.split("/")[6]
        router.push(`/pokemon/${results[0].id}`)
      }else{
        pokemonsList.value = []
        results.map( async pokemon => {
          await axios.get(pokemon.url).then(response => pokemonsList.value.push(response.data))
        })
        pokemonsList.value.sort( (a, b) => a.id - b.id )
      }
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Introduce el nombre de algun pokemon',
      })
    }
  }
  const ordenarArreglo = () => {
    pokemonsList.value.sort( (a, b) => a.id - b.id )
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
          <div class="search-bar"> 
            <input type="search" v-model="pokemon" placeholder="Buscar un pokemon" @blur="searchPokemon" name="" id="" class="input-search">
          </div>
          <div class="pokemon-list">
              <div @click="showPokemonData(index)" class="pokemon-item" v-for="(pokemon, index) in pokemonsList" :key="index">
                  <img class="sprite" :src="pokemon.sprites.front_default"/> 
                  <p>{{pokemon.name}}</p>
              </div>
          </div>
          <div class="content-pagination">
            <button id="paginator-prev" @click="getPrevPokemon" class="paginator">
              Anterior
            </button>
            <button id="paginator-next" @click="getNextPokemon" class="paginator">
              Siguiente
            </button>
          </div>
      </div>
    </div>
  
</template>

<style scoped>
@import url('../styles/VistaPrincipal.css');
</style>
