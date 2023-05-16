<template>
    <section id="report">
        <div class="head">
            <div class="total_count" v-if="api.type === 1">
                <div class="flag">
                    <div>註冊數</div>
                    <span>{{ api.totalData.joinTotal }}</span>
                </div>
                <div class="flag">
                    <div>註冊率</div>
                    <span>{{ api.totalData.joinCR.toFixed(2) }}%</span>
                </div>
                <div class="flag">
                    <div>DEMO數</div>
                    <span>{{ api.totalSalesData.salesDemo
                    }}</span>
                </div>
                <div class="flag">
                    <div>合約數</div>
                    <span>{{ api.totalSalesData.salesContract
                    }}</span>
                </div>
                <div class="flag">
                    <div>轉換率</div>
                    <span v-if="isNaN(api.totalSalesData.contractCR)">0%</span>
                    <span v-else>{{ api.totalSalesData.contractCR.toFixed(2) }}%</span>
                </div>
            </div>
            <div class="total_count" v-else>
                <div class="flag">
                    <div>註冊數</div>
                    <span>{{ api.totalAdsData.joinTotal }}</span>
                </div>
                <div class="flag">
                    <div>註冊率</div>
                    <span>{{ api.totalAdsData.joinCR.toFixed(2) }}%</span>
                </div>
                <div class="flag">
                    <div>DEMO數</div>
                    <span>{{ api.totalAdsSalesData.salesDemo
                    }}</span>
                </div>
                <div class="flag">
                    <div>合約數</div>
                    <span>{{ api.totalAdsSalesData.salesContract
                    }}</span>
                </div>
                <div class="flag">
                    <div>轉換率</div>
                    <span>{{ api.totalAdsSalesData.contractCR.toFixed(2) }}%</span>
                </div>
            </div>
        </div>
        <div class="table_container">
            <div class="member_table">
                <div class="date_picker">
                    <VueDatePicker v-model="memberDate" range :enable-time-picker="false" :max-date="new Date() + 1">
                    </VueDatePicker>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>
                                <p>
                                    {{ listTitle }}名稱
                                </p>
                            </th>
                            <th @click="channelAdsSort">
                                <p>廣告連結<br>
                                    點擊數
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_ads_sort == 0 || channel_sort_type !== 'ads'"></i>
                                    <i class="fa-solid fa-sort-down" v-else></i>
                                </p>
                            </th>
                            <th @click="channelJoinSort">
                                <p>註冊數total<br>
                                    (桌機/手機)
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_join_sort == 0 || channel_sort_type !== 'join'"></i>
                                    <i class="fa-solid fa-sort-down" v-else></i>
                                </p>
                            </th>
                            <th @click="channelJoinCRSort">
                                <p>註冊率<br>
                                    (註冊/點擊)
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_joinCR_sort == 0 || channel_sort_type !== 'joinCR'"></i>
                                    <i class="fa-solid fa-sort-down" v-else></i>
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in api.reportChannelMixData" v-if="api.type === 1">
                            <td class="th_name">{{ item.name }}</td>
                            <td>{{ item.clicksTotal }}</td>
                            <td>{{ item.joinTotal }}<br>{{ item.joinPC
                            }}&nbsp;/&nbsp;{{ item.joinMB }}</td>
                            <td>{{ item.joinCR.toFixed(2) + '%' }}</td>
                        </tr>
                        <tr v-for="(item, index) in api.reportAdsMixData" v-else>
                            <td class="th_name">
                                <i class="fa-regular fa-image" :id="'icon' + index" v-if="item.adImg"
                                    @mouseover="enlargeImage(index)" @mouseout="shrinkImage(index)"></i>
                                <!-- <img :src="item.adImg" :id="'img' + index" @error="handlerError(index)" v-if="item.adImg" /> -->
                                {{ item.adName }}
                            </td>
                            <td>{{ item.clicksPC + item.clicksMB }}</td>
                            <td>{{ item.joinTotal }}<br>{{ item.joinPC }}&nbsp;/&nbsp;{{ item.joinMB }}</td>
                            <td>{{ item.joinCR.toFixed(2) + '%' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="sales_table">
                <div class="date_picker">
                    <VueDatePicker v-model="salesDate" range :enable-time-picker="false" :max-date="new Date() + 1"
                        :min-date="startDate">
                    </VueDatePicker>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th @click="channelDemoSort">
                                <p>電銷<br>
                                    DEMO數
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_demo_sort == 0 || channel_sort_type !== 'demo'"></i>
                                    <i class="fa-solid fa-sort-down" v-else></i>
                                </p>
                            </th>
                            <th @click="channelContractSort">
                                <p>電銷<br>
                                    合約數
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_contract_sort == 0 || channel_sort_type !== 'contract'"></i>
                                    <i class="fa-solid fa-sort-down" v-else></i>
                                </p>
                            </th>
                            <th @click="channelAmountSort">
                                <p>成交金額
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_amount_sort == 0 || channel_sort_type !== 'amount'"></i>
                                    <i class="fa-solid fa-sort-down" v-else></i>
                                </p>
                            </th>
                            <th @click="channelContractCRSort">
                                <p>轉換率<br>
                                    (合約數/註冊數)
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_contractCR_sort == 0 || channel_sort_type !== 'contractCR'"></i>
                                    <i class="fa-solid fa-sort-down" v-else></i>
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in api.reportChannelMixData" v-if="api.type === 1">
                            <td>{{ item.salesDemo }}</td>
                            <td>{{ item.salesContract }}</td>
                            <td>{{ item.salesAmount }}</td>
                            <td v-if="isNaN(item.contractCR)">0.00%</td>
                            <td v-else>
                                {{ item.contractCR.toFixed(2) }}%
                            </td>
                        </tr>
                        <tr v-for="(item, index) in api.reportAdsMixData" v-else>
                            <td>{{ item.salesDemo }}</td>
                            <td>{{ item.salesContract }}</td>
                            <td>{{ item.salesAmount }}</td>
                            <td v-if="isNaN(item.contractCR)">0.00%</td>
                            <td v-else>
                                {{ item.contractCR.toFixed(2) }}%
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>
<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useApiStore } from "@/store/api.js"
import { ref, onMounted, watch, computed, reactive } from 'vue';
const api = useApiStore();
const memberDate = ref([new Date()]);
const salesDate = ref([new Date()]);
const startDate = ref(new Date());
const imageEnlarged = ref(false)

const channel_sort_type = ref()
const channel_ads_sort = ref(0)
const channel_join_sort = ref(0)
const channel_joinCR_sort = ref(0)
const channel_demo_sort = ref(0)
const channel_contract_sort = ref(0)
const channel_amount_sort = ref(0)
const channel_contractCR_sort = ref(0)



const listTitle = computed(() => {
    let name = api.type === 1 ? "通路" : "廣告"
    return name
})


watch(memberDate, () => {
    if (memberDate.value.length > 1) {
        salesDate.value = [memberDate.value[0], new Date()];
        startDate.value = memberDate.value[0];
        api.sDate = memberDate.value[0];
        api.eDate = memberDate.value[1];
        api.sDateSales = salesDate.value[0];
        api.eDateSales = salesDate.value[1];
    } else {
        api.sDate = memberDate.value[0];
        api.eDate = memberDate.value[0];
        api.sDateSales = salesDate.value[0];
        api.eDateSales = salesDate.value[0];
    }
    if (api.type === 1) {
        api.callChannelData();
    } else {
        api.callGroupData();
    }
})
watch(salesDate, () => {
    if (salesDate.value.length > 1) {
        api.sDateSales = salesDate.value[0];
        api.eDateSales = salesDate.value[1];
        if (api.type === 1) {
            api.callChannelData();
        } else {
            api.callGroupData();
        }
    }
})

const channelAdsSort = () => {
    if (channel_sort_type.value !== 'ads') {
        channel_sort_type.value = "ads"
        channel_ads_sort.value = 0;
    }
    if (channel_ads_sort.value < 1) {
        channel_ads_sort.value++;
        api.fnChannleSort("clicksTotal", 1)
    } else {
        channel_ads_sort.value = 0;
        api.fnChannleSort("clicksTotal", 0)
    }
}
const channelJoinSort = () => {
    if (channel_sort_type.value !== "join") {
        channel_sort_type.value = "join"
        channel_join_sort.value = 0;
    }
    if (channel_join_sort.value === 0) {
        channel_join_sort.value = 1;
        api.fnChannleSort("joinTotal", 1)
    } else {
        channel_join_sort.value = 0;
        api.fnChannleSort("joinTotal", 0)
    }
}
const channelJoinCRSort = () => {
    if (channel_sort_type.value !== "joinCR") {
        channel_sort_type.value = "joinCR"
        channel_joinCR_sort.value = 0;
    }
    if (channel_joinCR_sort.value === 0) {
        channel_joinCR_sort.value = 1;
        api.fnChannleSort("joinCR", 1)
    } else {
        channel_joinCR_sort.value = 0;
        api.fnChannleSort("joinCR", 0)
    }
}
const channelDemoSort = () => {
    if (channel_sort_type.value !== "demo") {
        channel_sort_type.value = "demo"
        channel_demo_sort.value = 0;
    }
    if (channel_demo_sort.value === 0) {
        channel_demo_sort.value = 1;
        api.fnChannleSort("salesDemo", 1)
    } else {
        channel_demo_sort.value = 0;
        api.fnChannleSort("salesDemo", 0)
    }
}
const channelContractSort = () => {
    if (channel_sort_type.value !== "contract") {
        channel_sort_type.value = "contract"
        channel_contract_sort.value = 0;
    }
    if (channel_contract_sort.value === 0) {
        channel_contract_sort.value = 1;
        api.fnChannleSort("salesContract", 1)
    } else {
        channel_contract_sort.value = 0;
        api.fnChannleSort("salesContract", 0)
    }
}
const channelAmountSort = () => {
    if (channel_sort_type.value !== "amount") {
        channel_sort_type.value = "amount"
        channel_amount_sort.value = 0;
    }
    if (channel_amount_sort.value === 0) {
        channel_amount_sort.value = 1;
        api.fnChannleSort("salesAmount", 1)
    } else {
        channel_amount_sort.value = 0;
        api.fnChannleSort("salesAmount", 0)
    }
}
const channelContractCRSort = () => {
    if (channel_sort_type.value !== "contractCR") {
        channel_sort_type.value = "contractCR"
        channel_contractCR_sort.value = 0;
    }
    if (channel_contractCR_sort.value === 0) {
        channel_contractCR_sort.value = 1;
        api.fnChannleSort("contractCR", 1)
    } else {
        channel_contractCR_sort.value = 0;
        api.fnChannleSort("contractCR", 0)
    }
}

const enlargeImage = (id) => {
    const img = document.getElementById(`img${id}`)
    img.style.display = "block";
}

const shrinkImage = (id) => {
    const img = document.getElementById(`img${id}`)
    img.style.display = "none";
}

const handlerError = (id) => {
    const icon = document.getElementById(`icon${id}`)
    icon.style.display = "none";
}


</script>