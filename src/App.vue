
<template>
    <NavBar></NavBar>
    <Report></Report>
    <Chart></Chart>
    <div class="loader_blk" v-if="api.loader">
        <span class="loader"></span>
    </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue"
import Report from "@/components/Report.vue"
import Chart from "@/components/Chart.vue"
import { onMounted } from 'vue';
import { useApiStore } from "@/store/api.js"

const api = useApiStore();

onMounted(() => {
    // api.callChannelData()
});
</script>
<style lang="scss">
@import "@/assets/scss/style.scss";

#app {
    font-family: 'Noto Sans TC', sans-serif;
    display: flex;
    justify-content: center;
}

.loader_blk {
    background-color: rgba($color: #000000, $alpha: .4);
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 3;
}

.loader {
    animation: rotate 1s infinite;
    height: 50px;
    width: 50px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.loader:before,
.loader:after {
    border-radius: 50%;
    content: "";
    display: block;
    height: 20px;
    width: 20px;
}

.loader:before {
    animation: ball1 1s infinite;
    background-color: #fff;
    box-shadow: 30px 0 0 #71DDB1;
    margin-bottom: 10px;
}

.loader:after {
    animation: ball2 1s infinite;
    background-color: #71DDB1;
    box-shadow: 30px 0 0 #fff;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg) scale(0.8)
    }

    50% {
        transform: rotate(360deg) scale(1.2)
    }

    100% {
        transform: rotate(720deg) scale(0.8)
    }
}

@keyframes ball1 {
    0% {
        box-shadow: 30px 0 0 #71DDB1;
    }

    50% {
        box-shadow: 0 0 0 #71DDB1;
        margin-bottom: 0;
        transform: translate(15px, 15px);
    }

    100% {
        box-shadow: 30px 0 0 #71DDB1;
        margin-bottom: 10px;
    }
}

@keyframes ball2 {
    0% {
        box-shadow: 30px 0 0 #fff;
    }

    50% {
        box-shadow: 0 0 0 #fff;
        margin-top: -20px;
        transform: translate(15px, 15px);
    }

    100% {
        box-shadow: 30px 0 0 #fff;
        margin-top: 0;
    }
}
</style>