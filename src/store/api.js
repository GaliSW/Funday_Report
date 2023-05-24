import { ref, computed, reactive, watch } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
export const useApiStore = defineStore("apiStore", () => {
    const loader = ref(false);
    const chart = ref(false);
    const type = ref(1); // 1=群組 2=通路
    const channelModel = ref([]);
    const groupModel = ref([]);
    const sDate = ref(new Date());
    const eDate = ref(new Date());
    const sDateSales = ref(new Date());
    const eDateSales = ref(new Date());
    const navData = ref();
    //report original store
    const channelData = ref();
    const channelSalesData = ref();
    const adsData = ref();
    const adsSalesData = ref();
    const totalData = ref({
        clicksMB: 0,
        clicksPC: 0,
        clicksTotal: 0,
        joinCR: 0,
        joinMB: 0,
        joinPC: 0,
        joinTotal: 0,
        joinPCCR: 0,
        joinMBCR: 0,
    }); //註冊相關總數
    const totalSalesData = ref({
        salesContract: 0,
        salesDemo: 0,
        salesDemoCR: 0,
        contractCR: 0,
        salesAmount: 0,
    }); //電銷相關總數

    //report select store
    const reportChannelData = ref([]);
    const reportChannelSalesData = ref([]);
    const reportChannelMixData = ref([]);
    const reportAdsData = ref([]);
    const reportAdsSalesData = ref([]);
    const reportAdsMixData = ref([]);
    const totalAdsData = ref({
        clicksMB: 0,
        clicksPC: 0,
        clicksTotal: 0,
        joinCR: 0,
        joinMB: 0,
        joinPC: 0,
        joinTotal: 0,
        joinPCCR: 0,
        joinMBCR: 0,
    }); //註冊相關總數
    const totalAdsSalesData = ref({
        salesContract: 0,
        salesDemo: 0,
        salesDemoCR: 0,
        contractCR: 0,
        salesAmount: 0,
    }); //電銷相關總數

    //Get NavList
    const getNavList = () => {
        return new Promise((resolve, reject) => {
            axios
                .get(`https://mktapi.funday.asia:4433/MKT/report/channel`)
                .then((res) => {
                    navData.value = res.data.channel;
                    resolve();
                });
        });
    };

    //*====== 通路 =====
    //Get channel data
    const getChannelData = () => {
        return new Promise((resolve, reject) => {
            const s = sDate.value;
            const e = eDate.value;
            const idArr = channelModel.value.sort().toString();
            let start = `${s.getFullYear()}-${s.getMonth() + 1}-${s.getDate()}`;
            let end;
            if (e) {
                end = `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`;
            } else {
                end = start;
            }
            axios
                .get(
                    `https://mktapi.funday.asia:4433/MKT/report/v2/channel-list?sdate=${start}&edate=${end}&channelId=${idArr}`
                )
                .then((res) => {
                    channelData.value = res.data.channel;
                    channelData.value.sort((a, b) => {
                        return a.id < b.id ? 1 : -1;
                    });
                    resolve();
                });
        });
    };

    //Get channel sales data
    const getChannelSalesData = () => {
        return new Promise((resolve, reject) => {
            const sL = sDate.value;
            const eL = eDate.value;
            const idArr = channelModel.value.sort().toString();
            let startL = `${sL.getFullYear()}-${
                sL.getMonth() + 1
            }-${sL.getDate()}`;
            let endL;
            if (eL) {
                endL = `${eL.getFullYear()}-${
                    eL.getMonth() + 1
                }-${eL.getDate()}`;
            } else {
                endL = startL;
            }
            const sR = sDateSales.value;
            const eR = eDateSales.value;
            let startR = `${sR.getFullYear()}-${
                sR.getMonth() + 1
            }-${sR.getDate()}`;
            let endR;
            if (eR) {
                endR = `${eR.getFullYear()}-${
                    eR.getMonth() + 1
                }-${eR.getDate()}`;
            } else {
                endR = startR;
            }
            axios
                .get(
                    `https://mktapi.funday.asia:4433/MKT/report/v2/channel-list-s?sdate=${startL}&edate=${endL}&sdate2=${startR}&edate2=${endR}&channelId=${idArr}`
                )
                .then((res) => {
                    channelSalesData.value = res.data.channel;
                    channelSalesData.value.sort((a, b) => {
                        return a.id < b.id ? 1 : -1;
                    });
                    resolve();
                });
        });
    };

    //set all channel data
    const callChannelData = async () => {
        if (channelModel.value.length === 0) return;
        chart.value = false;
        loader.value = true;
        await getChannelData();
        await getChannelSalesData();
        await getChannelTotal();

        //兩組資料合併
        reportChannelMixData.value = [];
        channelData.value.forEach((el, indx) => {
            reportChannelMixData.value.push(
                Object.assign(el, channelSalesData.value[indx])
            );
        });
        reportChannelMixData.value.sort((a, b) => {
            return a.joinTotal < b.joinTotal ? 1 : -1;
        });
        reportChannelMixData.value.forEach((el) => {
            const cr = (el.salesContract / el.joinTotal) * 100;
            if (isNaN(cr)) {
                el["contractCR"] = 0;
            } else {
                el["contractCR"] = cr;
            }
            const demoCR = (el.salesDemo / el.joinTotal) * 100;
            if (isNaN(demoCR)) {
                el["salesDemoCR"] = 0;
            } else {
                el["salesDemoCR"] = demoCR;
            }
        });
        chart.value = true;
        loader.value = false;
    };

    watch(channelModel, () => {
        if (channelModel.value.length === 0) {
            // callChannelData();
            reportChannelMixData.value = [];
            reportChannelSalesData.value = [];
            totalData.value = {
                clicksMB: 0,
                clicksPC: 0,
                clicksTotal: 0,
                joinCR: 0,
                joinMB: 0,
                joinPC: 0,
                joinTotal: 0,
            };
            totalSalesData.value = {
                salesContract: 0,
                salesDemo: 0,
                contractCR: 0,
                salesAmount: 0,
            };
            chart.value = false;
        }
    });

    //* ======== 群組 ==========
    //Get channel data
    const getGroupData = () => {
        return new Promise((resolve, reject) => {
            const s = sDate.value;
            const e = eDate.value;
            const idArr = groupModel.value.sort().toString();
            let start = `${s.getFullYear()}-${s.getMonth() + 1}-${s.getDate()}`;
            let end;
            if (e) {
                end = `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`;
            } else {
                end = start;
            }
            axios
                .get(
                    `https://mktapi.funday.asia:4433/MKT/report/v2/group-list?sdate=${start}&edate=${end}&groupId=${idArr}`
                )
                .then((res) => {
                    console.log(res);
                    adsData.value = res.data.ad.sort((a, b) => {
                        return a.adId < b.adId ? 1 : -1;
                    });
                    resolve();
                });
        });
    };

    //Get channel sales data
    const getGroupSalesData = () => {
        return new Promise((resolve, reject) => {
            const idArr = groupModel.value.sort().toString();
            const sL = sDate.value;
            const eL = eDate.value;
            let startL = `${sL.getFullYear()}-${
                sL.getMonth() + 1
            }-${sL.getDate()}`;
            let endL;
            if (eL) {
                endL = `${eL.getFullYear()}-${
                    eL.getMonth() + 1
                }-${eL.getDate()}`;
            } else {
                endL = startL;
            }
            const sR = sDateSales.value;
            const eR = eDateSales.value;
            let startR = `${sR.getFullYear()}-${
                sR.getMonth() + 1
            }-${sR.getDate()}`;
            let endR;
            if (eR) {
                endR = `${eR.getFullYear()}-${
                    eR.getMonth() + 1
                }-${eR.getDate()}`;
            } else {
                endR = startR;
            }
            axios
                .get(
                    `https://mktapi.funday.asia:4433/MKT/report/v2/group-list-s?sdate=${startL}&edate=${endL}&sdate2=${startR}&edate2=${endR}&groupId=${idArr}`
                )
                .then((res) => {
                    adsSalesData.value = res.data.ad;
                    adsSalesData.value.sort((a, b) => {
                        return a.adId < b.adId ? 1 : -1;
                    });
                    resolve();
                });
        });
    };

    //set all channel data
    const callGroupData = async () => {
        if (groupModel.value.length === 0) return;
        loader.value = true;
        chart.value = false;
        await getGroupData();
        await getGroupSalesData();
        await getGroupTotal();

        //兩組資料合併
        reportAdsMixData.value = [];
        adsData.value.forEach((el, indx) => {
            reportAdsMixData.value.push(
                Object.assign(el, adsSalesData.value[indx])
            );
        });

        reportAdsMixData.value.sort((a, b) => {
            return a.joinTotal < b.joinTotal ? 1 : -1;
        });
        reportAdsMixData.value.forEach((el) => {
            const cr = (el.salesContract / el.joinTotal) * 100;
            if (isNaN(cr)) {
                el["contractCR"] = 0;
            } else {
                el["contractCR"] = cr;
            }
            const demoCR = (el.salesDemo / el.joinTotal) * 100;
            if (isNaN(demoCR)) {
                el["salesDemoCR"] = 0;
            } else {
                el["salesDemoCR"] = demoCR;
            }
        });

        chart.value = true;
        loader.value = false;
    };

    watch(groupModel, () => {
        if (groupModel.value.length === 0) {
            // callGroupData();
            reportAdsMixData.value = [];
            reportAdsSalesData.value = [];
            totalAdsData.value = {
                clicksMB: 0,
                clicksPC: 0,
                clicksTotal: 0,
                joinCR: 0,
                joinMB: 0,
                joinPC: 0,
                joinTotal: 0,
            };
            totalAdsSalesData.value = {
                salesContract: 0,
                salesDemo: 0,
                contractCR: 0,
                salesAmount: 0,
            };
            chart.value = false;
        }
    });

    const getChannelTotal = () => {
        return new Promise((resolve, reject) => {
            const s = sDate.value;
            const e = eDate.value;
            let start = `${s.getFullYear()}-${s.getMonth() + 1}-${s.getDate()}`;
            let end;
            if (e) {
                end = `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`;
            } else {
                end = start;
            }
            const idArr = channelModel.value.sort().toString();
            axios
                .get(
                    `https://mktapi.funday.asia:4433/MKT/report/total?sdate=${start}&edate=${end}&channelId=${idArr}`
                )
                .then((res) => {
                    if (res.data == "") {
                        totalData.value = {
                            clicksMB: 0,
                            clicksPC: 0,
                            clicksTotal: 0,
                            joinCR: 0,
                            joinMB: 0,
                            joinPC: 0,
                            joinTotal: 0,
                        };
                    } else {
                        totalData.value = res.data.data[0];
                    }
                });

            const sSales = sDateSales.value;
            const eSales = eDateSales.value;
            let salesStart = `${sSales.getFullYear()}-${
                sSales.getMonth() + 1
            }-${sSales.getDate()}`;
            let salesEnd;
            if (e) {
                salesEnd = `${eSales.getFullYear()}-${
                    eSales.getMonth() + 1
                }-${eSales.getDate()}`;
            } else {
                salesEnd = salesStart;
            }
            axios
                .get(
                    `https://mktapi.funday.asia:4433/MKT/report/total-s?sdate=${start}&edate=${end}&sdate2=${salesStart}&edate2=${salesEnd}&channelId=${idArr}`
                )
                .then((res) => {
                    if (res.data == "") {
                        totalSalesData.value = {
                            salesContract: 0,
                            salesDemo: 0,
                            contractCR: 0,
                        };
                    } else {
                        const contractCR =
                            (res.data.data[0].salesContract /
                                totalData.value.joinTotal) *
                            100;
                        totalSalesData.value = res.data.data[0];
                        totalSalesData.value["contractCR"] = contractCR;
                        const demoCR =
                            (res.data.data[0].salesDemo /
                                totalData.value.joinTotal) *
                            100;
                        totalSalesData.value = res.data.data[0];
                        totalSalesData.value["salesDemoCR"] = demoCR;
                    }
                    resolve();
                });
        });
    };
    const getGroupTotal = () => {
        return new Promise((resolve, reject) => {
            const s = sDate.value;
            const e = eDate.value;
            let start = `${s.getFullYear()}-${s.getMonth() + 1}-${s.getDate()}`;
            let end;
            if (e) {
                end = `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`;
            } else {
                end = start;
            }
            const idArr = groupModel.value.sort().toString();
            if (idArr.length === 0) {
                resolve();
                return;
            }
            axios
                .get(
                    `https://mktapi.funday.asia:4433/MKT/report/total?sdate=${start}&edate=${end}&groupId=${idArr}`
                )
                .then((res) => {
                    if (res.data == "") {
                        totalAdsData.value = {
                            clicksMB: 0,
                            clicksPC: 0,
                            clicksTotal: 0,
                            joinCR: 0,
                            joinMB: 0,
                            joinPC: 0,
                            joinTotal: 0,
                        };
                    } else {
                        totalAdsData.value = res.data.data[0];
                    }
                });

            const sSales = sDateSales.value;
            const eSales = eDateSales.value;
            let salesStart = `${sSales.getFullYear()}-${
                sSales.getMonth() + 1
            }-${sSales.getDate()}`;
            let salesEnd;
            if (e) {
                salesEnd = `${eSales.getFullYear()}-${
                    eSales.getMonth() + 1
                }-${eSales.getDate()}`;
            } else {
                salesEnd = salesStart;
            }
            axios
                .get(
                    `https://mktapi.funday.asia:4433/MKT/report/total-s?sdate=${start}&edate=${end}&sdate2=${salesStart}&edate2=${salesEnd}&groupId=${idArr}`
                )
                .then((res) => {
                    if (res.data == "") {
                        totalAdsSalesData.value = {
                            salesContract: 0,
                            salesDemo: 0,
                            contractCR: 0,
                        };
                    } else {
                        const contractCR =
                            (res.data.data[0].salesContract /
                                totalAdsData.value.joinTotal) *
                            100;
                        totalAdsSalesData.value = res.data.data[0];
                        totalAdsSalesData.value["contractCR"] = contractCR;
                        const demoCR =
                            (res.data.data[0].salesDemo /
                                totalAdsData.value.joinTotal) *
                            100;
                        totalAdsSalesData.value = res.data.data[0];
                        totalAdsSalesData.value["salesDemoCR"] = demoCR;
                    }
                    resolve();
                });
        });
    };

    //*========= 排序 ========
    const fnChannleSort = (key, status) => {
        loader.value = true;
        if (type.value === 1) {
            if (status === 0) {
                reportChannelMixData.value.sort((a, b) => {
                    return a[key] > b[key] ? 1 : -1;
                });
            } else {
                reportChannelMixData.value.sort((a, b) => {
                    return a[key] < b[key] ? 1 : -1;
                });
            }
        } else {
            if (status === 0) {
                reportAdsMixData.value.sort((a, b) => {
                    return a[key] > b[key] ? 1 : -1;
                });
            } else {
                reportAdsMixData.value.sort((a, b) => {
                    return a[key] < b[key] ? 1 : -1;
                });
            }
        }
        loader.value = false;
    };

    return {
        type,
        loader,
        sDate,
        eDate,
        channelModel,
        groupModel,
        navData,
        adsData,
        totalData,
        totalSalesData,
        totalAdsData,
        totalAdsSalesData,
        reportAdsData,
        adsSalesData,
        reportChannelData,
        reportChannelSalesData,
        reportChannelMixData,
        reportAdsData,
        reportAdsSalesData,
        reportAdsMixData,
        getNavList,
        getChannelData,
        callChannelData,
        callGroupData,
        fnChannleSort,
        channelData,
        sDateSales,
        eDateSales,
        chart,
    };
});
