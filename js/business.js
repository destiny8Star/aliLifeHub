requirejs.config({
    baseUrl: "js/",
    paths: {
        "flex": "apps/flexible",
        "public": "apps/public",
        "swx": "apps/setWx-config",
        "jquery": "https://code.jquery.com/jquery-3.2.1.min",
        "wui": "https://cdn.bootcss.com/jquery-weui/1.2.1/js/jquery-weui.min",
        "ajs": "https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min"
    },
    shim: {
        "wui": {
            deps: ['jquery'],
        },
    }
})
requirejs(["jquery", "wui", "flex", "ajs", "public", "swx"],function($,wui,flex,ajs,public,swx){
    //登录授权
    var code = public.getUrlParms("code");
    console.log('code', code)
    let openid = localStorage.getItem("openid");
    if (!openid) {
        swx.authorize(code, timestamp)
        openid = localStorage.getItem("openid");
    }
    //是否绑定手机号,判断是否需要重新授权
    function isBind(openid) {
        $.ajax({
            url: public.baseUrl + "/api/third/Mall/isCardUser",//zy接口
            data: {
                timestamp: "121",
                deviceId: "1",
                appVersion: "1",
                deviceType: "1",
                phoneSystemVersion: "1",
                openId: openid
            },
            method: "POST",
            dataType: "json",
            success: function (res) {
                console.log("板顶结果", res)
                if (res.code == 200) {
                    return
                } else if (res.code == 11081) {
                    swx.authorize(code, timestamp)
                    openid = localStorage.getItem("openid");
                    //重新调用
                    isBind(openid)
                } else {
                    ajs.showToast({
                        content: "网络异常",
                        type: "fail"
                    });
                }
            }
        })
    }
    isBind(openid)
    console.log("openid", openid)
    //获取城市
    var cityAre = localStorage.getItem("city");
    console.log("获取城市", cityAre)
    if (!cityAre) {
        $(".lack").show()
        //调用获取城市的ajs接口------------------------------------------
        // wx.ready(function () {
        //     getLoc()
        // });
    }

    //获取城市
    function getLoc(){
        ajs.getLocation(1,function (res) {
            // output.innerHTML = JSON.stringify(res, undefined, '  ');
             ajs.confirm({
                title: '提示',
                content: "城市"+JSON.stringify(res),
            });
        });
    }

    // function getLoc() {
    //     wx.getLocation({
    //         type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    //         success: function (res) {
    //             console.log("获取位置", res)
    //             let lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
    //             let lon = res.longitude; // 经度，浮点数，范围为180 ~ -180。
    //             let speed = res.speed; // 速度，以米/每秒计
    //             let accuracy = res.accuracy; // 位置精度
    //             getCitys(lat, lon)
    //         },
    //         fail: function () {
    //             console.log("点击取消")
    //         }
    //     });
    // }
    //获取城市
    // function getCitys(lat, lon) {
    //     let url = "http://apis.map.qq.com/ws/geocoder/v1/?"
    //     let data = {
    //         key: "AHFBZ-2ZYED-EKO4U-PZTE5-D7CCQ-ZXBPC",
    //         location: lat + "," + lon
    //     }
    //     data.output = "jsonp";
    //     $.ajax({
    //         type: "get",
    //         url: url,
    //         dataType: 'jsonp',
    //         jsonp: "callback",
    //         jsonpCallback: "QQmap",
    //         data: data,
    //         success: function (res) {
    //             $(".lack").hide()
    //             console.log("获取到了", res)
    //             cityAre = res.result.address_component
    //             let city = JSON.stringify(res.result.address_component)
    //             localStorage.setItem("city", city)
    //             loadlist(1);
    //         },
    //         error: function (err) { alert("网络错误") }
    //     })
    // }
    //手动获取
    $(".weui-btn").click(function () {
        // getLoc()
    })
    //---------------------------------------------------
    var cursor = 1;//页数
    // var size = 4;
    var loading = false; //状态标记
    $(function () {
        ajs.showLoading("加载中");
        tabList();
        loadlist(1)
    })
    //=========================下拉刷新
    $("#listwrap").pullToRefresh().on("pull-to-refresh", function () {
       
        setTimeout(function () {
            cursor = 1;
            console.log("loading", loading)
            if (loading) loading = false;
            loadlist(1);
            tabList();
            $("#listwrap").pullToRefreshDone(); // 重置下拉刷新
        }, 1500); //模拟延迟
    });
    //============================滚动加载
    $("#listwrap").infinite().on("infinite", function () {
        console.log("loading", cursor)
        if (loading) return;
        loading = true;

        $(".weui-cells__title").removeClass("show-more")
        $('.weui-loadmore').show();
        setTimeout(function () {
            loadlist(cursor);
            loading = false;
        }, 1500); //模拟延迟
    });
    // =======加载数据loadlist();
    function tabList() {
        $.ajax({
            url: public.baseUrl + "/api/third/Mall/banner",//zy接口
            type: "POST",
            data: {
                timestamp: "121",
                deviceId: "1",
                appVersion: "1",
                deviceType: "1",
                phoneSystemVersion: "1"
            },
            dataType: "json",
            success: function (res) {
                ajs.hideLoading();
                console.log("banner", res)
                if (res.code == 200) {
                    let data = res.data
                    let str = ""
                    $.each(data, function (i, e) {
                        switch (e.targetWay) {
                            case 0: str += '<a href="#"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 1: str += '<a href="#"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 2: str += '<a href="#"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 3: str += '<a href="' + e.linkUrl + '"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 4: str += '<a href="#"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 5: str += '<a href="business/detail.html?storeId=' + e.targetId + '"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 6: str += '<a href="#"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                            case 7: str += '<a href="business/busListB.html?cid=' + e.targetId + '"><div class="type-item"><img src="' + e.detailPic + '" alt=""><span>' + e.mainTitle + '</span></div></a>';
                                break;
                        }
                    })
                    $(".bus-type").html(str)
                } else {
                    ajs.showToast({
                        content: "网络异常",
                        type: "fail"
                    });
                }
            }
        })
    }
    function loadlist(page) {
        console.log("cityAre", cityAre)
        $.ajax({
            type: "POST",
            url: public.baseUrl + "/api/third/Mall/list",//zy接口
            data: {
                timestamp: "121",
                deviceId: "1",
                appVersion: "1",
                deviceType: "1",
                phoneSystemVersion: "1",
                cursor: page,
                city: cityAre.city,
                area: cityAre.district
            },
            dataType: "json",
            error: function (request) {
                $(".weui-loadmore").hide();
                $(".weui-cells__title").addClass("show-more")
            },
            success: function (res) {
                ajs.hideLoading();
                console.log("list", res)
                if (res.code == 200 && res.data.data.length > 0) {
                    let data = res.data.data
                    let str = ""
                    $.each(data, function (i, e) {
                        if (e.categoryName) {
                            str += '<a href="business/detail.html?storeId=' + e.storeId + '"><div class="store-item flex"><div class="store-item-img"><img src="' + e.storeUrl + '" alt=""></div><div class="store-item-woc"><h3 class="store-tit">' + e.storeName + '</h3><div class="store-det"><span>' + e.categoryName + '</span> | <span>人气' + e.sentiment + '</span></div><p class="store-add">' + e.address + '</p></div></div></a>'
                        } else {
                            str += '<a href="business/detail.html?storeId=' + e.storeId + '"><div class="store-item flex"><div class="store-item-img"><img src="' + e.storeUrl + '" alt=""></div><div class="store-item-woc"><h3 class="store-tit">' + e.storeName + '</h3><div class="store-det"><span> </span> | <span>人气' + e.sentiment + '</span></div><p class="store-add">' + e.address + '</p></div></div></a>'
                        }
                    })
                    cursor++; //页数
                    if (page > 1) {
                        $(".bus-store").append(str);
                    } else {
                        $(".bus-store").html(str);
                    }

                } else {
                    $(".weui-cells__title").addClass("show-more")
                    loading = true;
                }
                $(".weui-loadmore").hide();
            }
        });
    }
})