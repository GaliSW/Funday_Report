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
    }); //註冊相關總數
    const totalSalesData = ref({
        salesContract: 0,
        salesDemo: 0,
        contractCR: 0,
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
    }); //註冊相關總數
    const totalAdsSalesData = ref({
        salesContract: 0,
        salesDemo: 0,
        contractCR: 0,
    }); //電銷相關總數

    //Get NavList
    const getNavList = () => {
        return new Promise((resolve, reject) => {
            axios
                .get(`http://192.168.11.65:8000/MKT/report/channel`)
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
                    `http://192.168.11.65:8000/MKT/report/channel-list?sdate=${start}&edate=${end}&channelId=${idArr}`
                )
                .then((res) => {
                    channelData.value = res.data.channel;
                    resolve();
                });
        });
    };

    //Get channel sales data
    const getChannelSalesData = () => {
        return new Promise((resolve, reject) => {
            const s = sDateSales.value;
            const e = eDateSales.value;
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
                    `http://192.168.11.65:8000/MKT/report/channel-list-s?sdate=${start}&edate=${end}&channelId=${idArr}`
                )
                .then((res) => {
                    channelSalesData.value = res.data.channel;
                    resolve();
                });
        });
    };

    //set all channel data
    const callChannelData = async () => {
        chart.value = false;
        loader.value = true;
        await getChannelData();
        await getChannelSalesData();
        await getChannelTotal();

        //註冊資料
        reportChannelData.value = [];
        let channelArr = [];
        if (channelData.value !== undefined) {
            for (let i = 0; i < channelModel.value.length; i++) {
                if (channelData.value[i]) {
                    if (channelData.value[i].id === channelModel.value[i]) {
                        channelArr = [...channelArr, channelData.value[i]];
                    }
                }
            }
            reportChannelData.value = channelArr;
        }

        //電銷數據
        reportChannelSalesData.value = [];
        let channelSalesArr = [];
        for (let i = 0; i < channelModel.value.length; i++) {
            if (channelSalesData.value[i]) {
                if (channelSalesData.value[i].id === channelModel.value[i]) {
                    channelSalesArr = [
                        ...channelSalesArr,
                        channelSalesData.value[i],
                    ];
                    channelSalesArr[i]["contractCR"] =
                        (channelSalesArr[i].salesContract /
                            reportChannelData.value[i].joinTotal) *
                        100;
                }
            }
        }

        //兩組資料合併
        reportChannelMixData.value = [];
        reportChannelSalesData.value = channelSalesArr;
        reportChannelData.value.forEach((el, indx) => {
            reportChannelMixData.value.push(
                Object.assign(el, reportChannelSalesData.value[indx])
            );
        });
        reportChannelMixData.value.sort((a, b) => {
            return a.joinTotal < b.joinTotal ? 1 : -1;
        });
        chart.value = true;
        loader.value = false;
    };

    watch(channelModel, () => {
        if (channelModel.value.length > 0) {
            callChannelData();
        } else {
            reportChannelData.value = [];
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
            };
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
                    `http://192.168.11.65:8000/MKT/report/group-list?sdate=${start}&edate=${end}&groupId=${idArr}`
                )
                .then((res) => {
                    adsData.value = res.data.ad;
                    resolve();
                });
        });
    };

    //Get channel sales data
    const getGroupSalesData = () => {
        return new Promise((resolve, reject) => {
            const s = sDateSales.value;
            const e = eDateSales.value;
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
                    `http://192.168.11.65:8000/MKT/report/group-list-s?sdate=${start}&edate=${end}&groupId=${idArr}`
                )
                .then((res) => {
                    adsSalesData.value = res.data.ad;
                    resolve();
                });
        });
    };

    //set all channel data
    const callGroupData = async () => {
        loader.value = true;
        chart.value = false;
        await getGroupData();
        await getGroupSalesData();
        await getGroupTotal();

        //註冊資料
        reportAdsData.value = [];
        let adsArr = [];
        if (adsData.value !== undefined) {
            for (let i = 0; i < groupModel.value.length; i++) {
                for (let j = 0; j < adsData.value.length; j++) {
                    if (adsData.value[j].groupId === groupModel.value[i]) {
                        adsArr = [...adsArr, adsData.value[j]];
                    }
                }
            }
            reportAdsData.value = adsArr;
        }

        //電銷數據
        reportAdsSalesData.value = [];
        let adsSalesArr = [];
        for (let i = 0; i < groupModel.value.length; i++) {
            for (let j = 0; j < adsData.value.length; j++) {
                if (adsSalesData.value[j]) {
                    if (adsSalesData.value[j].groupId === groupModel.value[i]) {
                        adsSalesArr = [...adsSalesArr, adsSalesData.value[j]];
                        // adsSalesArr[j]["contractCR"] =
                        //     (adsSalesArr[j].salesContract /
                        //         reportAdsData.value[j].joinTotal) *
                        //     100;
                    }
                }
            }
        }

        //兩組資料合併
        reportAdsMixData.value = [];
        reportAdsSalesData.value = adsSalesArr;
        reportAdsData.value.forEach((el, indx) => {
            reportAdsMixData.value.push(
                Object.assign(el, reportAdsSalesData.value[indx])
            );
        });
        reportAdsMixData.value.sort((a, b) => {
            return a.joinTotal < b.joinTotal ? 1 : -1;
        });
        reportAdsMixData.value.forEach((el) => {
            el["contractCR"] = (el.salesContract / el.joinTotal) * 100;
        });

        chart.value = true;
        loader.value = false;
    };

    watch(groupModel, () => {
        if (groupModel.value.length > 0) {
            callGroupData();
        } else {
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
            };
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
                    `http://192.168.11.65:8000/MKT/report/total?sdate=${start}&edate=${end}&channelId=${idArr}`
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
                    `http://192.168.11.65:8000/MKT/report/total-s?sdate=${salesStart}&edate=${salesEnd}&channelId=${idArr}`
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
            axios
                .get(
                    `http://192.168.11.65:8000/MKT/report/total?sdate=${start}&edate=${end}&groupId=${idArr}`
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
                    `http://192.168.11.65:8000/MKT/report/total-s?sdate=${salesStart}&edate=${salesEnd}&groupId=${idArr}`
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
                    return a[key] < b[key] ? 1 : -1;
                });
            } else {
                reportChannelMixData.value.sort((a, b) => {
                    return a[key] > b[key] ? 1 : -1;
                });
            }
        } else {
            if (status === 0) {
                reportAdsMixData.value.sort((a, b) => {
                    return a[key] < b[key] ? 1 : -1;
                });
            } else {
                reportAdsMixData.value.sort((a, b) => {
                    return a[key] > b[key] ? 1 : -1;
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
