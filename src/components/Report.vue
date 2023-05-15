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
                    <span>{{ api.totalSalesData.contractCR.toFixed(2) }}%</span>
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
                            <th @click="channelSort">
                                <p>
                                    {{ listTitle }}名稱
                                    <i class="fa-sharp fa-solid fa-sort" v-if="channel_sort == 0 && api.type === 2"></i>
                                    <i class="fa-solid fa-sort-up" v-if="channel_sort == 1 && api.type === 2"></i>
                                    <i class="fa-solid fa-sort-down" v-if="channel_sort == 2 && api.type === 2"></i>
                                </p>
                            </th>
                            <th @click="channelAdsSort">
                                <p>廣告連結<br>
                                    點擊數
                                    <i class="fa-sharp fa-solid fa-sort" v-if="channel_ads_sort == 0"></i>
                                    <i class="fa-solid fa-sort-up" v-if="channel_ads_sort == 1"></i>
                                    <i class="fa-solid fa-sort-down" v-if="channel_ads_sort == 2"></i>
                                </p>
                            </th>
                            <th>
                                <p>註冊數total<br>
                                    (桌機/手機)<i class="fa-sharp fa-solid fa-sort"></i></p>
                            </th>
                            <th>
                                <p>註冊率<br>
                                    (註冊/點擊)<i class="fa-sharp fa-solid fa-sort"></i></p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in api.reportChannelMixData" v-if="api.type === 1">
                            <td>{{ item.name }}</td>
                            <td>{{ item.clicksTotal }}</td>
                            <td>{{ item.joinTotal }}<br>{{ item.joinPC
                            }}&nbsp;/&nbsp;{{ item.joinMB }}</td>
                            <td>{{ item.joinCR.toFixed(2) + '%' }}</td>
                        </tr>
                        <tr v-for="(item, index) in api.reportAdsMixData" v-else>
                            <td>{{ item.adName }}</td>
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
                            <th>
                                <p>電銷<br>
                                    DEMO數<i class="fa-sharp fa-solid fa-sort"></i></p>
                            </th>
                            <th>
                                <p>電銷<br>
                                    合約數<i class="fa-sharp fa-solid fa-sort"></i></p>
                            </th>
                            <th>
                                <p>成交金額<i class="fa-sharp fa-solid fa-sort"></i></p>
                            </th>
                            <th>
                                <p>轉換率<br>
                                    (合約數/註冊數)<i class="fa-sharp fa-solid fa-sort"></i></p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in api.reportChannelMixData" v-if="api.type === 1">
                            <td>{{ item.salesDemo }}</td>
                            <td>{{ item.salesContract }}</td>
                            <td>{{ item.salesAmount }}</td>
                            <td>{{ item.contractCR.toFixed(2) }}%</td>
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
import { ref, onMounted, watch, computed } from 'vue';
const api = useApiStore();
const memberDate = ref();
const salesDate = ref();
const startDate = ref();
const channel_sort = ref(0)
const channel_ads_sort = ref(0)
const channel_register_count_sort = ref(0)
const channel_register_rate_sort = ref(0)
const channel_demo_sort = ref(0)
const channel_contract_sort = ref(0)
const channel_deal_sort = ref(0)
const channel_transfer_sort = ref(0)


const listTitle = computed(() => {
    let name = api.type === 1 ? "通路" : "廣告"
    return name
})

onMounted(() => {
    memberDate.value = [new Date()];
    salesDate.value = [new Date()];
    startDate.value = new Date();
})

watch(memberDate, () => {
    if (memberDate.value.length > 1) {
        salesDate.value = [memberDate.value[0], new Date()];
        startDate.value = memberDate.value[0];
        api.sDate = memberDate.value[0];
        api.eDate = memberDate.value[1];
        if (api.type === 1) {
            api.callChannelData();
        } else {
            api.callGroupData();
        }
    }
})

const channelSort = () => {
    if (channel_sort.value < 2) {
        channel_sort.value++;
    } else {
        channel_sort.value = 0;
    }
}
const channelAdsSort = () => {
    if (channel_ads_sort.value < 2) {
        channel_ads_sort.value++;
    } else {
        channel_ads_sort.value = 0;
    }
}

</script>