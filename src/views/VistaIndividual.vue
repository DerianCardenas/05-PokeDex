<script setup>
import { RouterLink , RouterView} from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'
import VistaPrincipal from '../components/VistaPrincipal.vue'
const props = defineProps({
    id:{
        type:String,
        required:true
    }
})
const router = useRouter();
const pokemonData = ref([])
const oficialArtwork = ref("")
const recentSprite = ref("")
const shinySprite = ref("")
const imgSelected = ref("")
const tipos = ref({
    bug:"BICHO",
    dark:"SINIESTRO",
    dragon:"DRAGÓN",
    electric:"ELECTRICO",
    fairy:"HADA",
    fire:"FUEGO",
    flying:"VOLADOR",
    ghost:"FANTASMA",
    grass:"PLANTA",
    grund:"TIERRA",
    ice:"HIELO",
    normal:"NORMAL",
    poison:"VENENO",
    psychic:"PSÍQUICO",
    steel:"ACERO",
    water:"AGUA",

})
const movements = ref()
const movementsFull = ref([])
const stats = ref()
const statsNames = ref(["PS","ATQ","DEF","ATQ. ESP", "DEF. ESP","VEL"])
const getPokemonInfo = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon/${props.id}`
    await axios.get(url).then(response => pokemonData.value = response.data)
    oficialArtwork.value = pokemonData.value.sprites.other["official-artwork"].front_default
    recentSprite.value = pokemonData.value.sprites.versions ["generation-viii"].icons.front_default
    shinySprite.value = pokemonData.value.sprites.front_shiny
    imgSelected.value = oficialArtwork.value
    stats.value = pokemonData.value.stats
    movements.value = pokemonData.value.moves;
    await getMovements();
    ordenarArreglo();
}
const volver = () => {
    router.back();
}
const getMovements = async () => {
    movements.value.map( async el => {
        await axios.get(el.move.url).then(async response => {
            const data = response.data;
            var attack = ""
            var imgAtq = ""
            await axios.get(data.type.url).then(response2=>{
                attack = response2.data
            })
            attack.move_damage_class.name == "special" ? 
                imgAtq = "https://faqsmedia.ign.com/faqs/image/article/109/1094653/special_attack_icon.jpg" :
                imgAtq = "https://faqsmedia.ign.com/faqs/image/article/109/1094653/physical_attack_icon.jpg"
            var entradasEsp = []
            response.data.flavor_text_entries.map(el => {
                if(el.language.name == "es") entradasEsp.push(el)
            })
            entradasEsp[0].flavor_text = entradasEsp[0].flavor_text.replace("\n", " ")
            movementsFull.value.push({
                id:data.id,
                nombre:data.names[5].name,
                clase_ataque:data.damage_class.name,
                icono:imgAtq,
                precision:data.accuracy,
                pp:data.pp,
                poder:data.power,
                prioridad:data.priority,
                tipo:tipos.value[data.type.name].toLowerCase(),
                desc:entradasEsp[0]
            })
            ordenarArreglo();
        })
    })
    ordenarArreglo();
}
const changeImg = (index) =>{
    index == 1 ? imgSelected.value = oficialArtwork.value :
        index == 2 ? imgSelected.value = recentSprite.value :
        index == 3 ? imgSelected.value = shinySprite.value : ""
}
const ordenarArreglo = () => {
    movementsFull.value.sort( (a, b) => a.id - b.id )
}
getPokemonInfo()
</script>
<template>
    <div class="pokedex">
        <div class="pokedex-sprite">
            <span class="volver" @click="volver">VOLVER</span> 
            <img class="sprite" :src="imgSelected"/>
            <div class="icons">
                <span @click="changeImg(1)" class="icon"></span>
                <span @click="changeImg(2)" class="icon"></span>
                <span @click="changeImg(3)" class="icon"></span>
            </div>
            <div class="nombre">{{pokemonData.id.toString().padStart(3,0)}} -- {{pokemonData.name.toUpperCase()}} </div>
            <div class="tipos">
                <div class="tipo" v-for="type in pokemonData.types" :key="type">
                    {{tipos[type.type.name]}}
                </div>
            </div>
            <div class="estadisticas">
                <h3>ESTADISTICAS</h3>   
                <div class="cont-stats">
                    <div class="stat" v-for="(stat, index) in stats">
                       {{ statsNames[index] }} - {{stat.base_stat}}
                    </div>
                </div> 
            </div>
        </div>
        <div class="pokedex-info">
            <div class="movimientos">
                <h3>MOVIMIENTOS</h3>
                <div class="cont-movements">
                    <thead>
                        <tr class="header-table">
                            <td>NOMBRE </td>
                            <td>DESCRIPCIÓN </td>
                            <td>CATEGORÍA </td>
                            <td>TIPO </td>
                            <td>PP </td>
                            <td>PODER </td>
                        </tr>    
                    </thead>
                    <tbody>
                        <tr v-for="move in movementsFull" class="movement">
                            <td> {{ move.nombre}}  </td>
                            <td class="desc-mvm"> {{ move.desc.flavor_text }} </td>
                            <td> <img :src="move.icono" class="icon-mvm" alt="" srcset=""> </td>
                            <td> {{ move.tipo.toUpperCase()}}  </td>
                            <td> {{ move.pp}}  </td>
                            <td> {{ move.poder == null ? " - " : move.poder}}  </td>
                        </tr>    
                    </tbody>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.volver{
    padding: 1em;
    color:white;
}
.volver:hover{
    cursor: pointer;
}
.pokedex{
    display:flex;
    height: 100vh;
    width:100%;
}
.pokedex-sprite{
    background-color:red;
    border-right:5px solid white;
    height: 100vh;
    width: 35%;
}
.pokedex-info{
    background-color: #333;
    height: 100vh;
    width: 65%;
}
.sprite{
    display: flex;
    margin: .5em auto;
    width:60%;
}
.icons{
    display: flex;
    margin: 0 auto;
    width: 20%;
}
.icon{
    background-color: white;
    height: 20px;
    margin: 0 auto;
    width: 20px;
}
.icon:hover{
    cursor: pointer;
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
.estadisticas, .movimientos{
    color: white;
    margin: .5em auto;
    width: 95%;
}
h3{
    text-align: center;
    width: 100%;
}
.cont-stats{
    justify-content: space-evenlys;
}
.stat{
    margin: .5em auto;
    text-align: center;
    width: 50%;
}
.stat span{
    margin: 0 auto;
    text-align: center;
    width: 48%;
}
.header-table td{
    text-align: center;
}
.cont-movements{
    margin-top: .5em;
    max-height: 90vh;
    overflow-y: scroll;
}
.cont-movements::-webkit-scrollbar {
  width: 5px;               /* width of the entire scrollbar */
}
.cont-movements::-webkit-scrollbar-track  {
  background: red;   
}
.movement td{
    width: 10%;
    margin: .2em .5em;
    text-align: center;
}
.desc-mvm{
    width: 25%;
}
.icon-mvm{
    width: 50px;
}
</style>

