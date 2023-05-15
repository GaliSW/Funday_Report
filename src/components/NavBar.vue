<template>
    <section id="nav">
        <div class="logo">
            <img src="@/assets/images/FUNDAYLOGO.png" alt="">
            <h1>廣告成效報表</h1>
        </div>
        <div class="channel">
            <!-- <div class="type_tab">
                <input type="radio" id="channel_compare" name="tab" checked>
                <label for="channel_compare" @click="api.type = 1">通路</label>
                <input type="radio" id="group_compare" name="tab">
                <label for="group_compare" @click="api.type = 2">群組</label>
            </div> -->
            <div class="channel_list" v-if="api.type === 1">
                <div v-for="(item, index) in channelArr" @dblclick="api.type = 2, groupType = index">
                    <input type="checkbox" :id="item.id" :value="item.id" v-model="api.channelModel">
                    <label :for="item.id" class="group">{{ item.name }}</label>
                </div>
            </div>
            <div class="group_list" v-else>
                <div class="back" @click="api.type = 1">回上層</div>
                <div class="channel_blk">
                    <span>通路名稱:</span><br>
                    <p>{{ channelArr[groupType].name }}</p>
                </div>
                <div class="group_bar">
                    <span>群組</span>
                    <input type="checkbox" name="all" id="all" @click="selectAll($event)">
                    <label for="all">全選</label>
                    <!-- <div class="tab opt3" data="Option 1">
                        <input type="checkbox" name="switch" id="switch" @click="selectAll($event)">
                        <label for="switch" name="switch"></label>
                    </div> -->
                </div>
                <ul class="check_list">
                    <li v-for="(item, index) in groupList[groupType]">
                        <input type="checkbox" :id="item.id" :value="item.id" v-model="api.groupModel"
                            @change="checkLength">
                        <label :for="item.id">{{ item.name }}</label>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>
<script setup>
import { ref, onMounted, reactive, watch, computed } from 'vue';
import { useApiStore } from "@/store/api.js"

const api = useApiStore();

const channelArr = ref([]);
const groupType = ref(0);
const groupList = ref([]);

onMounted(async () => {
    await api.getNavList();
    channelArr.value = api.navData
    api.navData.forEach((el) => {
        groupList.value.push(el.group)
    })
})
watch(groupType, () => {
    api.groupModel = [];
})

const selectAll = (e) => {
    const status = e.target.checked
    if (status) {
        let arr = []
        groupList.value[groupType.value].forEach((el) => {
            arr.push(el.id)
        })
        api.groupModel = arr;
    } else {
        api.groupModel = []
    }
}

const checkLength = () => {
    if (api.groupModel.length === groupList.value[groupType.value].length) {
        document.getElementById("all").checked = true;
    } else {
        document.getElementById("all").checked = false;
    }
}

</script>