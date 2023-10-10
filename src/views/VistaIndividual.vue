<script setup>
import { RouterLink , RouterView} from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import axios from 'axios'
import VistaPrincipal from '../components/VistaPrincipal.vue'
const props = defineProps({
    id:{
        type:String,
        required:true
    }
})
const pokemonData = ref([])
const oficialArtwork = ref("")
const recentSprite = ref("")
const getPokemonInfo = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon/${props.id}`
    await axios.get(url).then(response => pokemonData.value = response.data)
    console.log( pokemonData.value);
    oficialArtwork.value = pokemonData.value.sprites.other["official-artwork"].front_default
    recentSprite.value = pokemonData.value.sprites.versions ["generation-viii"].icons.front_default
}
getPokemonInfo()
</script>
<template>
    <div class="pokedex">
        <div class="pokedex-sprite">
            <img class="sprite" :src="oficialArtwork"/>
            <div class="nombre">{{pokemonData.id.toString().padStart(3,0)}} -- {{pokemonData.name.toUpperCase()}} </div>
            <div class="tipos">
                <div class="tipo" v-for="type in pokemonData.types" :key="type">
                    {{type.type.name}}
                </div>
            </div>
        </div>
        <div class="pokedex-info">
            
        </div>
    </div>
</template>
<style scoped>
.pokedex{
    display:flex;
    height: 100vh;
    width:100%;
}
.pokedex-sprite{
    background-color:red;
    border-right:5px solid black;
    height: 100vh;
    width: 35%;
}
.pokedex-info{
    height: 100vh;
    width: 65%;
}
.sprite{
    margin: .5em auto;
    width:100%;
}
.tipos{
    display: flex;
    margin: .5em auto;
    text-align: center;
    width: 80%;
}
.nombre, .tipo{
    color:white;
    text-align: center;
    font-size:1.5em;
}
.tipo{
    margin: 0 auto;
}
</style>

