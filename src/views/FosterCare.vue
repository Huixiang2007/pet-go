<template>
    <div class="app">
        <NavBar />
        <div id="map-container">
            <MapContainer />

        </div>
    </div>

</template>

<script setup lang="ts">
// import MapContainer from '@/components/MapContainer.vue'
import MapContainer from '@/components/MapCom.vue'
import NavBar from '@/components/NavBar.vue'
</script>

<style scoped>
.app {
    margin: 0;
    padding: 0;
    border-top: 1px solid transparent;
}

#map-container {
    width: 100%;
    height: 100%;
    margin-top: 4rem;
}
</style>