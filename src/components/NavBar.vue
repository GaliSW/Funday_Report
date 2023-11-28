<template>
    <section id="nav">
        <div class="logo">
            <img src="@/assets/images/FUNDAYLOGO.png" alt="">
            <h1>廣告成效報表</h1>
        </div>
        <div class="update" @click="api.updateData">更新數據</div>
        <div class="channel">
            <div class="channel_list" v-if="api.type === 1">
                <div class="channel_bar">
                    <span>通路</span>
                    <div>
                        <input type="checkbox" name="allChannel" id="allChannel" @click="selectAllChannel($event)">
                        <label for="allChannel">全選</label>
                        <div class="send" @click="api.callChannelData()">送出</div>
                    </div>
                </div>
                <div v-for="(item, index) in channelArr" class="channel_btn">
                    <input type="checkbox" :id="item.id" :value="item.id" v-model="api.channelModel"
                        @change="checkChannelLength">
                    <label :for="item.id" class="group">{{ item.name }}</label>
                    <div @click="api.type = 2, groupType = index">
                        <i class="fa-solid fa-caret-right"></i>
                    </div>
                </div>
            </div>
            <div class="group_list" v-else>
                <div class="back" @click="api.type = 1">
                    回上層
                </div>
                <div class="channel_blk">
                    <span>通路名稱:</span><br>
                    <p>{{ channelArr[groupType].name }}</p>
                </div>
                <div class="group_bar">
                    <span>群組</span>
                    <div>
                        <input type="checkbox" name="all" id="all" @click="selectAllGroup($event)">
                        <label for="all">全選</label>
                        <div class="send" @click="api.callGroupData()">送出</div>
                    </div>
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

const type = computed(() => api.type)
watch(type, () => {
    api.chart = false;
    if (type.value === 1) {
        setTimeout(() => {
            checkChannelLength()
        }, 300)
    }
    setTimeout(() => {
        api.chart = true
    }, 300)
})
const selectAllChannel = (e) => {
    const status = e.target.checked
    if (status) {
        let arr = []
        channelArr.value.forEach((el) => {
            arr.push(el.id)
        })
        api.channelModel = arr;
    } else {
        api.channelModel = []
    }
}

const selectAllGroup = (e) => {
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

const checkChannelLength = () => {
    if (api.channelModel.length === channelArr.value.length) {
        document.getElementById("allChannel").checked = true;
    } else {
        document.getElementById("allChannel").checked = false;
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