<template>
    <section id="chart" :class="{ close: !isOpen }">
        <div class="chart_wrapper">
            <div class="tag_btn" @click="isOpen = !isOpen">
                圖表
                <i class="fa-solid fa-angles-left"></i>
            </div>
            <div class="bar_chart">
                <Bar id="register_chart" :options="chart1Options" :data="chart1Data" v-if="bar1Render" />
            </div>
            <div class="bar_chart">
                <Bar id="register_chart" :options="chart2Options" :data="chart2Data" v-if="bar2Render" />
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
const bar1Render = ref(false)
const bar2Render = ref(false)
const pieRender = ref(false)
const bar1NameArr = ref([])
const bar2NameArr = ref([])
const bar1ResultArr = ref([])
const bar2ResultArr = ref([])
const bar1RandomColor = ref([])
const bar2RandomColor = ref([])
const pieNameArr = ref([])
const pieResultArr = ref([])
const pieRandomColor = ref([])

const reportData = ref()

const chart1Data = computed(() => ({
    labels: bar1NameArr.value,
    datasets: [{
        data: bar1ResultArr.value,
        backgroundColor: bar1RandomColor.value,
        borderColor: bar1RandomColor.value,
        borderWidth: 1,
        barPercentage: 0.3,
        categoryPercentage: 1,
        scaleFontColor: "#000",
    }]
}))
const chart2Data = computed(() => ({
    labels: bar2NameArr.value,
    datasets: [{
        data: bar2ResultArr.value,
        backgroundColor: bar2RandomColor.value,
        borderColor: bar2RandomColor.value,
        borderWidth: 1,
        barPercentage: 0.3,
        categoryPercentage: 1,
        scaleFontColor: "#000",
    }]
}))

const chart1Options = computed(() => ({
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
            text: '合約數排行',
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
            suggestedMax: bar1ResultArr.value[0] + 100,
        },
        y: {
            grid: {
                display: false,
                color: "#fff"
            },
            beginAtZero: true,
            ticks: {
                color: '#fff', font: {
                    size: 12,
                }
            },
        }
    }

}))

const chart2Options = computed(() => ({
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
            text: '註冊數排行',
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
            suggestedMax: bar2ResultArr.value[0] + 100,
        },
        y: {
            grid: {
                display: false,
                color: "#fff"
            },
            beginAtZero: true,
            ticks: {
                color: '#fff', font: {
                    size: 12,
                }
            },
        }
    }

}))

const pieData = computed(() => ({
    labels: pieNameArr.value,
    datasets: [{
        data: pieResultArr.value,
        backgroundColor: bar1RandomColor.value,
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
            color: "#fff",
            borderRadius: 1,
            font: {
                size: 12,
                weight: 'bold',
                color: '#fff',
            },
            formatter: (value) => {
                return value > 0 ? value + '%' : '';
            }
        },
        title: {
            display: true,
            text: '註冊數占比',
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

const chartCanDraw = computed(() => {
    return api.chart
})

watch(chartCanDraw, () => {
    bar1Render.value = false
    bar1NameArr.value = [];
    bar1ResultArr.value = [];
    bar1RandomColor.value = [];
    bar2Render.value = false
    bar2NameArr.value = [];
    bar2ResultArr.value = [];
    bar2RandomColor.value = [];
    pieRender.value = false
    pieNameArr.value = [];
    pieResultArr.value = [];
    pieRandomColor.value = [];
    if (chartCanDraw.value) {
        setTimeout(() => {
            setChart()
        }, 500)
    }
})


const setChart = async () => {
    if (api.type === 1) {
        reportData.value = api.reportChannelMixData;
        reportData.value.sort((a, b) => {
            return a.joinTotal < b.joinTotal ? 1 : -1;
        });
        reportData.value.forEach((el, num) => {
            bar2NameArr.value.push(`${num + 1}.${el.name}`)
            bar2ResultArr.value.push(el.joinTotal)
            bar2RandomColor.value.push(dynamicColors());

            pieNameArr.value.push(el.name)
            pieResultArr.value.push(((el.joinTotal / api.totalData.joinTotal) * 100).toFixed(2))
            pieRandomColor.value.push(dynamicColors());
        })
        const salesSort = await reportData.value.sort((a, b) => {
            return a.salesContract < b.salesContract ? 1 : -1;
        });
        salesSort.forEach((el, num) => {
            bar1NameArr.value.push(`${num + 1}.${el.name}`)
            bar1ResultArr.value.push(el.salesContract)
            bar1RandomColor.value.push(dynamicColors());
        })
    } else {
        reportData.value = api.reportAdsMixData;
        reportData.value.sort((a, b) => {
            return a.joinTotal < b.joinTotal ? 1 : -1;
        });
        reportData.value.forEach((el, indx) => {
            if (indx > 9) return;
            bar2NameArr.value.push(`${indx + 1}.${el.adName}`)
            bar2ResultArr.value.push(el.joinTotal)
            bar2RandomColor.value.push(dynamicColors());
            pieNameArr.value.push(el.adName)
            pieResultArr.value.push(((el.joinTotal / api.totalAdsData.joinTotal) * 100).toFixed(2))
            pieRandomColor.value.push(dynamicColors());
        })
        const salesSort = await reportData.value.sort((a, b) => {
            return a.salesContract < b.salesContract ? 1 : -1;
        });
        salesSort.forEach((el, num) => {
            if (num > 9) return;
            bar1NameArr.value.push(`${num + 1}.${el.adName}`)
            bar1ResultArr.value.push(el.salesContract)
            bar1RandomColor.value.push(dynamicColors());
        })
    }
    pieRender.value = true
    bar1Render.value = true
    bar2Render.value = true
}

const dynamicColors = () => {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * (255 - 100) + 100);
    let b = Math.floor(Math.random() * (255 - 100) + 100);
    let color = "rgba(" + r + "," + g + "," + b + "," + 1 + ")";
    return color;
};


</script> 