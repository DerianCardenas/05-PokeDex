<script setup>
import { RouterLink , RouterView} from 'vue-router';
const props = defineProps({
    show:{
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div v-if="show" class="menu">
        <div class="gen">Generación 1</div>
        <div class="gen">Generación 2</div>
        <div class="gen">Generación 3</div>
        <div class="gen">Generación 4</div>
        <div class="gen">Generación 5</div>
        <div class="gen">Generación 6</div>
        <div class="gen">Generación 7</div>
        <div class="gen">Generación 8</div>
    </div>
</template>
<style scoped>
.menu{
    background-color:white;
    border-radius:2em;
    color:red;
    font-size:1.5em;
    position: absolute;
    top: 26.3%;
    left: 40%;
    width:20%;
    z-index: 1;
}
.gen{
    margin: .5em auto;
    text-align: center;
}
</style>

