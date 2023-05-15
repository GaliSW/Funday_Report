<template>
    <section id="chart" :class="{ close: !isOpen }">
        <div class="chart_wrapper">
            <div class="tag_btn" @click="isOpen = !isOpen">
                圖表
                <i class="fa-solid fa-angles-left"></i>
            </div>
            <div class="bar_chart">
                <Bar id="register_chart" :options="chartOptions" :data="chartData" v-if="barRender" />
            </div>
            <div class="pie_chart">
                <Pie id="pie" :options="pieOptions" :data="pieData" v-if="pieRender" />
            </div>
        </div>
    </section>
</template>
<script setup>
import { Bar, Pie } from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { useApiStore } from "@/store/api.js"
const api = useApiStore();

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels, ArcElement)

const isOpen = ref(false);
const barRender = ref(false)
const pieRender = ref(false)
const barNameArr = ref([])
const barResultArr = ref([])
const barRandomColor = ref([])
const pieNameArr = ref([])
const pieResultArr = ref([])
const pieRandomColor = ref([])

const reportData = ref()

const chartData = computed(() => ({
    labels: barNameArr.value,
    datasets: [{
        data: barResultArr.value,
        backgroundColor: barRandomColor.value,
        borderColor: barRandomColor.value,
        borderWidth: 1,
        barPercentage: 0.3,
        categoryPercentage: 1,
        scaleFontColor: "#000",
    }]
}))

const chartOptions = computed(() => ({
    indexAxis: 'y',
    bezierCurve: false,
    animations: false,
    responsive: true,
    maintainAspectRatio: false,
    elements: {
        bar: {
            borderWidth: 2,
        }
    },
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: '會員數排行',
            color: "#fff",
            font: {
                size: 24
            }
        },
        datalabels: {
            anchor: 'end',
            align: 'end',
            formatter: (val) => (`${val}`),
            labels: {
                value: {
                    color: '#fff'
                }
            }
        }
    },
    scales: {
        x: {
            display: false,
            beginAtZero: true,
            grid: {
                display: false,
            },
            suggestedMin: 0,
            suggestedMax: barResultArr.value[0] + 100,
        },
        y: {
            grid: {
                display: false,
                color: "#fff"
            },
            beginAtZero: true,
            ticks: {
                color: '#fff', font: {
                    size: 16,
                }
            },
        }
    }

}))

const pieData = computed(() => ({
    labels: pieNameArr.value,
    datasets: [{
        data: pieResultArr.value,
        backgroundColor: barRandomColor.value,
        hoverOffset: 10,
        borderWidth: 1,
        barPercentage: 1,
        categoryPercentage: 1,
        scaleFontColor: "#fff",
        fontColor: "#fff"
    }]
}))

const pieOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            // display: false,
            position: 'bottom',
            labels: {
                color: '#fff',
                usePointStyle: true,
            }
        },
        datalabels: {
            display: true,
            align: 'end',
            anchor: "center",
            color: "#000",
            borderRadius: 1,
            font: {
                size: 12,
                weight: 'bold',
                color: '#fff',
            },
            formatter: (value) => {
                return value + '%';
            },
        },
        title: {
            display: true,
            text: '會員數占比',
            color: "#fff",
            font: {
                size: 24
            }
        },
    },
    layout: {
        padding: 20
    }
})
const channelModel = computed(() => {
    return api.channelModel
})
const dateRange = computed(() => {
    const arr = [api.sDate, api.eDate]
    return arr
})

watch(channelModel, () => {
    barRender.value = false
    barNameArr.value = [];
    barResultArr.value = [];
    barRandomColor.value = [];
    pieRender.value = false
    pieNameArr.value = [];
    pieResultArr.value = [];
    pieRandomColor.value = [];
    setTimeout(() => {
        setChart()
    }, 500)
})
watch(dateRange, () => {
    barRender.value = false
    barNameArr.value = [];
    barResultArr.value = [];
    barRandomColor.value = [];
    pieRender.value = false
    pieNameArr.value = [];
    pieResultArr.value = [];
    pieRandomColor.value = [];
    setTimeout(() => {
        setChart()
    }, 500)
})
// const type = computed(() => {
//     return api.type;
// })

// watch(type, () => {
//     barRender.value = false
//     barNameArr.value = [];
//     barResultArr.value = [];
//     barRandomColor.value = [];
//     pieRender.value = false
//     pieNameArr.value = [];
//     pieResultArr.value = [];
//     pieRandomColor.value = [];
// })

const setChart = () => {
    if (api.type === 1) {
        reportData.value = api.reportChannelData;
    } else {
        reportData.value = api.reportAdsData;
    }
    reportData.value.forEach((el) => {
        barNameArr.value.push(el.name)
        pieNameArr.value.push(el.name)
        barResultArr.value.push(el.joinTotal)
        pieResultArr.value.push(((el.joinTotal / api.totalData.joinTotal) * 100).toFixed(2))
        barRandomColor.value.push(dynamicColors());
        pieRandomColor.value.push(dynamicColors());
    })
    pieRender.value = true
    barRender.value = true
}

const dynamicColors = () => {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * (255 - 100) + 100);
    let b = Math.floor(Math.random() * (255 - 100) + 100);
    let color = "rgba(" + r + "," + g + "," + b + "," + 1 + ")";
    return color;
};


</script> 