<template>
    <section id="report">
        <div class="head">
            <div class="total_count" v-if="api.type === 1">
                <div class="ads_total">
                    <div class="flag">
                        <div>點擊數</div>
                        <span>{{ api.totalData.clicksTotal }}</span>
                    </div>
                    <div class="flag">
                        <div>註冊數</div>
                        <span>{{ api.totalData.joinTotal }}</span>
                    </div>
                    <div class="flag">
                        <div>註冊率</div>
                        <span>{{ api.totalData.joinCR.toFixed(2) }}%</span>
                    </div>
                </div>
                <div class="sales_total">
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
                        <div>成交率</div>
                        <span v-if="isNaN(api.totalSalesData.contractCR)">0%</span>
                        <span v-if="api.totalSalesData.contractCR == 'Infinity'">-</span>
                        <span v-if="api.totalSalesData.contractCR >= 0 && api.totalSalesData.contractCR != 'Infinity'">{{
                            api.totalSalesData.contractCR.toFixed(2) }}%</span>
                    </div>
                </div>
            </div>
            <div class="total_count" v-else>
                <div class="ads_total">
                    <div class="flag">
                        <div>點擊數</div>
                        <span>{{ api.totalAdsData.clicksTotal }}</span>
                    </div>
                    <div class="flag">
                        <div>註冊數</div>
                        <span>{{ api.totalAdsData.joinTotal }}</span>
                    </div>
                    <div class="flag">
                        <div>註冊率</div>
                        <span>{{ api.totalAdsData.joinCR.toFixed(2) }}%</span>
                    </div>
                </div>
                <div class="sales_total">
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
                        <div>成交率</div>
                        <span v-if="isNaN(api.totalAdsSalesData.contractCR)">0%</span>
                        <span v-if="api.totalAdsSalesData.contractCR == 'Infinity'">-</span>
                        <span
                            v-if="api.totalAdsSalesData.contractCR >= 0 && api.totalAdsSalesData.contractCR != 'Infinity'">{{
                                api.totalAdsSalesData.contractCR.toFixed(2) }}%</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="table_container">
            <div class="member_table">
                <table>
                    <thead class="lock_date">
                        <tr>
                            <th colspan="5">
                                <div class="date_picker">
                                    <i class="fa-solid fa-angle-left" @click="prevAdsDate()"></i>
                                    <i class="fa-solid fa-angle-right" @click="nextAdsDate()"
                                        :class="{ deny: !canNext }"></i>
                                    <VueDatePicker v-model="memberDate" range :enable-time-picker="false"
                                        :max-date="new Date() + 1">
                                    </VueDatePicker>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <thead class="lock">
                        <tr>
                            <th @click="channelIdSort">
                                <p>
                                    {{ listTitle }}編號
                                    <i class="fa-solid fa-sort" v-if="channel_sort_type !== 'id'"></i>
                                    <i class="fa-solid fa-sort-down"
                                        v-if="channel_id_sort == 0 && channel_sort_type == 'id'"></i>
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_id_sort == 1 && channel_sort_type == 'id'"></i>
                                </p>
                            </th>
                            <th>
                                <p>
                                    {{ listTitle }}名稱
                                </p>
                            </th>
                            <th @click="channelAdsSort">
                                <p>廣告點擊數total<br>
                                    (桌機/手機)
                                    <i class="fa-solid fa-sort" v-if="channel_sort_type !== 'ads'"></i>
                                    <i class="fa-solid fa-sort-down"
                                        v-if="channel_ads_sort == 0 && channel_sort_type == 'ads'"></i>
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_ads_sort == 1 && channel_sort_type == 'ads'"></i>
                                </p>
                            </th>
                            <th @click="channelJoinSort">
                                <p>註冊數total<br>
                                    (桌機/手機)
                                    <i class="fa-solid fa-sort" v-if="channel_sort_type !== 'join'"></i>
                                    <i class="fa-solid fa-sort-down"
                                        v-if="channel_join_sort == 0 && channel_sort_type == 'join'"></i>
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_join_sort == 1 && channel_sort_type == 'join'"></i>
                                </p>
                            </th>
                            <th @click="channelJoinCRSort">
                                <p>註冊率<br>
                                    (桌機/手機)<br>
                                    (註冊/點擊)
                                    <i class="fa-solid fa-sort" v-if="channel_sort_type !== 'joinCR'"></i>
                                    <i class="fa-solid fa-sort-down"
                                        v-if="channel_joinCR_sort == 0 && channel_sort_type == 'joinCR'"></i>
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_joinCR_sort == 1 && channel_sort_type == 'joinCR'"></i>
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in api.reportChannelMixData" v-if="api.type === 1">
                            <td>{{ item.id }}</td>
                            <td class="th_name">{{ item.name }}</td>
                            <td v-if="item.id === 0">-</td>
                            <td v-else>{{ item.clicksTotal }}<br>{{ item.clicksPC
                            }}&nbsp;/&nbsp;{{ item.clicksMB }}</td>
                            <td>{{ item.joinTotal }}<br>{{ item.joinPC
                            }}&nbsp;/&nbsp;{{ item.joinMB }}</td>
                            <td v-if="item.id === 0">-</td>
                            <td v-else :class="[{ red: item.joinCR < 1 }, { green: item.joinCR > 2 }]">{{
                                item.joinCR.toFixed(2) +
                                '%' }}<br>
                                {{ item.joinPCCR.toFixed(2) + '%' }}&nbsp;/&nbsp;{{ item.joinMBCR.toFixed(2) + '%' }}</td>
                        </tr>
                        <tr v-for="(item, index) in api.reportAdsMixData" v-else>
                            <td class="ads_date">
                                <span>{{ item.adSdate }}</span><br>{{ item.adId }}
                            </td>
                            <td class="th_name">
                                <i class="fa-regular fa-image" :id="'icon' + index" v-if="item.adImg"
                                    @mouseover="enlargeImage(index)" @mouseout="shrinkImage(index)"></i>
                                <img :src="item.adImg" :id="'img' + index" @error="handlerError(index)" v-if="item.adImg" />
                                {{ item.adName }}
                            </td>
                            <td>{{ item.clicksTotal }}<br>{{ item.clicksPC }}&nbsp;/&nbsp;{{ item.clicksMB }}</td>
                            <td class="view" @click="callLineChart(item.adId)">{{ item.joinTotal }}<br>{{ item.joinPC
                            }}&nbsp;/&nbsp;{{ item.joinMB }}</td>
                            <td :class="[{ red: item.joinCR < 1 }, { green: item.joinCR > 2 }]">
                                {{ item.joinCR.toFixed(2) + '%' }}<br>
                                {{ item.joinPCCR.toFixed(2) + '%' }}&nbsp;/&nbsp;{{ item.joinMBCR.toFixed(2) + '%' }}
                            </td>
                        </tr>
                    </tbody>
                    <thead class="lock_bottom left_bottom">
                        <tr v-if="api.type === 1">
                            <th colspan="2">
                                <p>
                                    總數
                                </p>
                            </th>
                            <th>
                                <p>
                                    {{ api.totalData.clicksTotal }}
                                </p>
                            </th>
                            <th>
                                <p>
                                    {{ api.totalData.joinTotal }}
                                </p>
                            </th>
                            <th>
                                <p>
                                    {{ api.totalData.joinCR.toFixed(2) }}%
                                </p>
                            </th>
                        </tr>
                        <tr v-else>
                            <th colspan="2">
                                <p>
                                    總數
                                </p>
                            </th>
                            <th>
                                <p>
                                    {{ api.totalAdsData.clicksTotal }}
                                </p>
                            </th>
                            <th>
                                <p>
                                    {{ api.totalAdsData.joinTotal }}
                                </p>
                            </th>
                            <th>
                                <p>
                                    {{ api.totalAdsData.joinCR.toFixed(2) }}%
                                </p>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="sales_table">
                <table>
                    <thead class="lock_date">
                        <tr>
                            <th colspan="5">
                                <div class="date_picker">
                                    <VueDatePicker v-model="salesDate" range :enable-time-picker="false"
                                        :max-date="new Date() + 1" :min-date="startDate">
                                    </VueDatePicker>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <thead class="lock">
                        <tr>
                            <th @click="channelDemoSort">
                                <p>電銷<br>
                                    DEMO數
                                    <i class="fa-solid fa-sort" v-if="channel_sort_type !== 'demo'"></i>
                                    <i class="fa-solid fa-sort-down"
                                        v-if="channel_demo_sort == 0 && channel_sort_type == 'demo'"></i>
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_demo_sort == 1 && channel_sort_type == 'demo'"></i>
                                </p>
                            </th>
                            <th @click="channelDemoCRSort">
                                <p>DEMO轉換率<br>
                                    (DEMO/註冊)
                                    <i class="fa-solid fa-sort" v-if="channel_sort_type !== 'demoCR'"></i>
                                    <i class="fa-solid fa-sort-down"
                                        v-if="channel_demoCR_sort == 0 && channel_sort_type == 'demoCR'"></i>
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_demoCR_sort == 1 && channel_sort_type == 'demoCR'"></i>
                                </p>
                            </th>
                            <th @click="channelContractSort">
                                <p>電銷<br>
                                    合約數
                                    <i class="fa-solid fa-sort" v-if="channel_sort_type !== 'contract'"></i>
                                    <i class="fa-solid fa-sort-down"
                                        v-if="channel_contract_sort == 0 && channel_sort_type == 'contract'"></i>
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_contract_sort == 1 && channel_sort_type == 'contract'"></i>
                                </p>
                            </th>
                            <th @click="channelAmountSort">
                                <p>成交金額
                                    <i class="fa-solid fa-sort" v-if="channel_sort_type !== 'amount'"></i>
                                    <i class="fa-solid fa-sort-down"
                                        v-if="channel_amount_sort == 0 && channel_sort_type == 'amount'"></i>
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_amount_sort == 1 && channel_sort_type == 'amount'"></i>
                                </p>
                            </th>
                            <th @click="channelContractCRSort">
                                <p>成交率<br>
                                    (合約數/註冊數)
                                    <i class="fa-solid fa-sort" v-if="channel_sort_type !== 'contractCR'"></i>
                                    <i class="fa-solid fa-sort-down"
                                        v-if="channel_contractCR_sort == 0 && channel_sort_type == 'contractCR'"></i>
                                    <i class="fa-solid fa-sort-up"
                                        v-if="channel_contractCR_sort == 1 && channel_sort_type == 'contractCR'"></i>
                                </p>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in api.reportChannelMixData" v-if="api.type === 1">
                            <td>{{ item.salesDemo }}</td>
                            <td v-if="item.salesDemoCR == 'Infinity'">-</td>
                            <td v-if="item.salesDemoCR >= 0 && item.salesDemoCR != 'Infinity'">
                                {{ item.salesDemoCR.toFixed(2) }}%
                            </td>
                            <td>{{ item.salesContract }}</td>
                            <td>${{ numberFormat(item.salesAmount) }}</td>
                            <td v-if="item.contractCR == 'Infinity'">-</td>
                            <td v-if="item.contractCR >= 0 && item.contractCR != 'Infinity'">
                                {{ item.contractCR.toFixed(2) }}%
                            </td>
                        </tr>
                        <tr v-for="(item, index) in api.reportAdsMixData" v-else>
                            <td>{{ item.salesDemo }}</td>
                            <td v-if="item.salesDemoCR == 'Infinity'">-</td>
                            <td v-if="item.salesDemoCR >= 0 && item.salesDemoCR != 'Infinity'">
                                {{ item.salesDemoCR.toFixed(2) }}%
                            </td>
                            <td>{{ item.salesContract }}</td>
                            <td>${{ numberFormat(item.salesAmount) }}</td>
                            <td v-if="isNaN(item.contractCR)">0.00%</td>
                            <td v-if="item.contractCR == 'Infinity'">-</td>
                            <td v-if="item.contractCR >= 0 && item.contractCR != 'Infinity'">
                                {{ item.contractCR.toFixed(2) }}%
                            </td>

                        </tr>
                    </tbody>
                    <thead class="lock_bottom right_bottom">
                        <tr v-if="api.type === 1">
                            <th>
                                <p>{{ api.totalSalesData.salesDemo }}</p>
                            </th>
                            <th>
                                <p>
                                    <span v-if="isNaN(api.totalSalesData.salesDemoCR)">0%</span>
                                    <span v-if="api.totalSalesData.salesDemoCR == 'Infinity'">-</span>
                                    <span
                                        v-if="api.totalSalesData.salesDemoCR >= 0 && api.totalSalesData.salesDemoCR != 'Infinity'">{{
                                            api.totalSalesData.salesDemoCR.toFixed(2) }}%</span>
                                </p>
                            </th>
                            <th>
                                <p>
                                    {{ api.totalSalesData.salesContract }}
                                </p>
                            </th>
                            <th>
                                <p>
                                    ${{ numberFormat(api.totalSalesData.salesAmount) }}
                                </p>
                            </th>
                            <th>
                                <p>
                                    <span v-if="isNaN(api.totalSalesData.contractCR)">0%</span>
                                    <span v-if="api.totalSalesData.contractCR == 'Infinity'">-</span>
                                    <span
                                        v-if="api.totalSalesData.contractCR >= 0 && api.totalSalesData.contractCR != 'Infinity'">{{
                                            api.totalSalesData.contractCR.toFixed(2) }}%</span>
                                </p>
                            </th>
                        </tr>
                        <tr v-else>
                            <th>
                                <p>{{ api.totalAdsSalesData.salesDemo }}</p>
                            </th>
                            <th>
                                <p>
                                    <span v-if="isNaN(api.totalAdsSalesData.salesDemoCR)">0%</span>
                                    <span v-if="api.totalAdsSalesData.salesDemoCR == 'Infinity'">-</span>
                                    <span
                                        v-if="api.totalAdsSalesData.salesDemoCR >= 0 && api.totalAdsSalesData.salesDemoCR != 'Infinity'">{{
                                            api.totalAdsSalesData.salesDemoCR.toFixed(2) }}%</span>
                                </p>
                            </th>
                            <th>
                                <p>
                                    {{ api.totalAdsSalesData.salesContract }}
                                </p>
                            </th>
                            <th>
                                <p>
                                    ${{ numberFormat(api.totalAdsSalesData.salesAmount) }}
                                </p>
                            </th>
                            <th>
                                <p>
                                    <span v-if="isNaN(api.totalAdsSalesData.contractCR)">0%</span>
                                    <span v-if="api.totalAdsSalesData.contractCR == 'Infinity'">-</span>
                                    <span
                                        v-if="api.totalAdsSalesData.contractCR >= 0 && api.totalAdsSalesData.contractCR != 'Infinity'">{{
                                            api.totalAdsSalesData.contractCR.toFixed(2) }}%</span>
                                </p>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        </div>
        <div class="line_chart" v-if="chartOpen">
            <i class="fa-solid fa-circle-xmark" @click="chartOpen = !chartOpen"></i>
            <Line id="register_chart" :options="lineOptions" :data="lineData" />
        </div>
    </section>
</template>
<script setup>
import { Line } from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, ArcElement, LineElement, PointElement, Filler } from 'chart.js'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useApiStore } from "@/store/api.js"
import { ref, onMounted, watch, computed, reactive } from 'vue';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, ChartDataLabels, ArcElement, LineElement, PointElement, Filler)

const api = useApiStore();
const memberDate = ref([new Date(), new Date()]);
const salesDate = ref([new Date(), new Date()]);
const startDate = ref(new Date());
const canNext = ref(false)

const channel_sort_type = ref()
const channel_id_sort = ref(0)
const channel_ads_sort = ref(0)
const channel_join_sort = ref(0)
const channel_joinCR_sort = ref(0)
const channel_demo_sort = ref(0)
const channel_demoCR_sort = ref(0)
const channel_contract_sort = ref(0)
const channel_amount_sort = ref(0)
const channel_contractCR_sort = ref(0)

const chartOpen = ref(false)
const lineNameArr = ref([])
const lineResultArr = ref([])
const linePcResultArr = ref([])
const lineMbResultArr = ref([])


const lineData = computed(() => ({
    labels: lineNameArr.value,
    datasets: [{
        label: "總註冊數",
        data: lineResultArr.value,
        backgroundColor: "rgba(75, 192, 192,.2)",
        hoverOffset: 10,
        borderWidth: 3,
        pointStyle: 'circle',
        pointRadius: 3,
        pointHoverRadius: 15,
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0
    }, {
        label: "桌機註冊",
        data: linePcResultArr.value,
        backgroundColor: "rgba(44, 96, 201,.2)",
        hoverOffset: 10,
        borderWidth: 3,
        pointStyle: 'circle',
        pointRadius: 3,
        pointHoverRadius: 15,
        fill: true,
        borderColor: "rgb(44, 96, 201)",
        tension: 0
    }, {
        label: "手機註冊",
        data: lineMbResultArr.value,
        backgroundColor: "rgba(207, 101, 39,.2)",
        hoverOffset: 10,
        borderWidth: 3,
        pointStyle: 'circle',
        pointRadius: 3,
        pointHoverRadius: 15,
        radius: 0,
        borderColor: "rgb(207, 101, 39)",
        tension: 0,
        fill: true,
    }]
}))

const lineOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            // display: false,
            position: 'bottom',
            labels: {
                color: '#000',
                usePointStyle: true,
            }
        },
        datalabels: {
            display: false,
            align: 'end',
            anchor: "center",
            color: "rgb(221, 113, 126)",
            borderRadius: 1,
            font: {
                size: 12,
                weight: 'bold',
                color: '#000',
            },
        },
    },
    layout: {
        padding: 30
    }
})



const listTitle = computed(() => {
    let name = api.type === 1 ? "通路" : "廣告"
    return name
})
const channelModel = computed(() => api.channelModel)
const groupModel = computed(() => api.groupModel)
watch(channelModel, () => {
    channel_sort_type.value = "";
})
watch(groupModel, () => {
    channel_sort_type.value = "";
})

watch(memberDate, async () => {
    startDate.value = memberDate.value[0];
    salesDate.value = [memberDate.value[0], memberDate.value[1]];
    if (memberDate.value[1]) {
        api.sDate = memberDate.value[0];
        api.eDate = memberDate.value[1];
        api.sDateSales = memberDate.value[0];
        api.eDateSales = memberDate.value[1];
    } else {
        memberDate.value = [memberDate.value[0], memberDate.value[0]];
        salesDate.value = [memberDate.value[0], memberDate.value[0]];
        api.sDate = memberDate.value[0];
        api.eDate = memberDate.value[0];
        api.sDateSales = memberDate.value[0];
        api.eDateSales = memberDate.value[0];
    }
    if (memberDate.value[1].getTime() + 86400000 < new Date().getTime()) {
        canNext.value = true;
    }
    if (api.type === 1) {
        await api.callChannelData();
    } else {
        api.callGroupData();
    }
})
watch(salesDate, () => {
    if (salesDate.value[1]) {
        api.sDateSales = salesDate.value[0];
        api.eDateSales = salesDate.value[1];
    } else {
        api.sDateSales = salesDate.value[0];
        api.eDateSales = salesDate.value[0];
    }
    // if (api.type === 1) {
    //     api.callChannelData();
    // } else {
    //     api.callGroupData();
    // }
})


const channelIdSort = () => {
    if (channel_sort_type.value !== 'id') {
        channel_sort_type.value = "id"
        channel_id_sort.value = 0;
    }
    if (channel_id_sort.value < 1) {
        channel_id_sort.value++;
        if (api.type === 1) {
            api.fnChannleSort("id", 1)
        } else {
            api.fnChannleSort("adId", 1)
        }
    } else {
        channel_id_sort.value = 0;
        if (api.type === 1) {
            api.fnChannleSort("id", 0)
        } else {
            api.fnChannleSort("adId", 0)
        }
    }
}

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
const channelDemoCRSort = () => {
    if (channel_sort_type.value !== "demoCR") {
        channel_sort_type.value = "demoCR"
        channel_demoCR_sort.value = 0;
    }
    if (channel_demoCR_sort.value === 0) {
        channel_demoCR_sort.value = 1;
        api.fnChannleSort("salesDemoCR", 1)
    } else {
        channel_demoCR_sort.value = 0;
        api.fnChannleSort("salesDemoCR", 0)
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

const numberFormat = (num) => {
    let internationalNumberFormat = new Intl.NumberFormat('en-US');
    return internationalNumberFormat.format(num);
}


Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
}
const nextAdsDate = () => {
    const range = (memberDate.value[1] - memberDate.value[0]) / 86400000
    if (range === 0) {
        if (memberDate.value[1].getTime() + 86400000 < new Date().getTime()) {
            let date = memberDate.value[1].addDays(1)
            memberDate.value = [date, date];
            if (date.getTime() + 86400000 > new Date().getTime()) {
                canNext.value = false;
            } else {
                canNext.value = true;
            }
        } else {
            canNext.value = false;
            return;
        }
    } else {
        if (memberDate.value[1] < new Date()) {
            let sdate = memberDate.value[0].addDays(range + 1)
            let edate = memberDate.value[1].addDays(range + 1)
            if (edate > new Date()) {
                return;
            }
            memberDate.value = [sdate, edate];
        } else {
            return;
        }
    }
}
const prevAdsDate = () => {
    canNext.value = true;
    const range = (memberDate.value[0] - memberDate.value[1]) / 86400000
    if (range === 0) {
        let date = memberDate.value[1].addDays(-1)
        memberDate.value = [date, date];
    } else {
        let sdate = memberDate.value[0].addDays(range - 1)
        let edate = memberDate.value[1].addDays(range - 1)
        memberDate.value = [sdate, edate];
    }
}


const callLineChart = async (id) => {
    api.loader = true;
    lineNameArr.value = [];
    lineResultArr.value = [];
    linePcResultArr.value = [];
    lineMbResultArr.value = [];
    await api.getLineData(id);
    api.lineData.forEach((el) => {
        lineNameArr.value.push(el.date);
        lineResultArr.value.push(el.joinTotal);
        linePcResultArr.value.push(el.joinPC);
        lineMbResultArr.value.push(el.joinMB);
    })
    api.loader = false;
    chartOpen.value = true;
}

</script>