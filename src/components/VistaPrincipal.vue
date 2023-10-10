<script setup>
  import { onMounted, ref, watch } from 'vue';
  import router from '@/router'
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
    }, 700);
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
  
</template>

<style scoped>
.container{
  display:flex;
  height:100vh;
  overflow:hidden;
  width:100%;
}
.left-content, .right-content{
  width:48%;
}
.left-content{
  background-color:red;
}
.center-content{
  background-color:black;
  width:6%;
}
.center-circle{
  background-color:white;
  border:10px solid black;
  border-radius:50%;
  margin-top:37vh;
  left: -50%;
  position:relative;
  width:200%;
  height:26vh;
}
.center-circle-2{
  background-color:white;
  border:5px solid #E5E5E5;
  border-radius:50%;
  height:16.5vh;
  left: 13%;
  margin-top:15%;
  position:relative;
  transition: all .7s ease-in-out;
  width:16.5vh;
}
.center-circle-2:hover{
  background-color:#E5E5E5;
  border:5px solid black;
  cursor:pointer;
}
.salida-izquierda{
  transition: all .7s ease-in-out;
  transform: translateX(-100%);
}

.salida-derecha{
  transition: all .7s ease-in-out;
  transform: translateX(-100%);
}
.btn-menu{
    background-color: green;
    border-radius: 50%;
    color:white;
    height: 4em;
    margin: 1em;
    position: absolute;
}
.btn-menu:hover{
    cursor:pointer
}
.pokedex-content{
  background-color:#309AF1;
  display:none;
  height:100vh;
  overflow:hidden;
  width:100%;
}
.pokemon-list{
  display:grid;
  display: flex;
  flex-wrap: wrap;
  margin: 2% auto;
  width:90%; 
}
.pokemon-item{
  background-color:transparent;
  border: 5px dotted white;
  border-radius: 1em;
  margin: .5% 1.6%;
  transition: all .7s ease-in-out;
  width:13%;
}
.pokemon-item:hover{
  background-color:#4949F9;
  cursor:pointer;
}
.sprite{
  display: flex;
  margin: 0 auto;
  width:70%;
}
p{
  color: white;
  text-align: center;
}
</style>
