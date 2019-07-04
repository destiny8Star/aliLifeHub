requirejs.config({
    baseUrl: "../js/",
    paths: {
        "flex": "apps/flexible",
        "public": "apps/public",
        "jquery": "https://code.jquery.com/jquery-3.2.1.min",
        "wui": "https://cdn.bootcss.com/jquery-weui/1.2.1/js/jquery-weui.min",
    },
    shim: {
        "wui": {
            deps: ['jquery'],
        },
    }
})
requirejs(["jquery", "wui", "flex",  "public"], function ($, wui, flex,  public){
    let cityAre = localStorage.getItem("city");
    let cid = public.getUrlParms("cid")

    var cursor = 1;//页数
    var loading = false; //状态标记
    $(function () {
        loadlist(1);
    })
    //=========================下拉刷新
    $("#listwrap").pullToRefresh().on("pull-to-refresh", function () {
        setTimeout(function () {
            cursor = 1;
            console.log("loading", loading)
            if (loading) loading = false;
            loadlist(1);
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
    function loadlist(page) {
        $.ajax({
            type: "POST",
            url: public.baseUrl + "/api/third/Mall/category",//zy接口
            data: {
                timestamp: "121",
                deviceId: "1",
                appVersion: "1",
                deviceType: "1",
                phoneSystemVersion: "1",
                cursor: page,
                city: cityAre.city,
                area: cityAre.district,
                cid: cid
            },
            dataType: "json",
            error: function (request) {
                $(".weui-loadmore").hide();
                $(".weui-cells__title").addClass("show-more")
            },
            success: function (res) {
                console.log("list", res)
                if (res.code == 200 && res.data.data.length > 0) {
                    let data = res.data.data
                    let str = ""
                    $.each(data, function (i, e) {
                        if (e.categoryName) {
                            str += '<a href="detail.html?storeId=' + e.storeId + '"><div class="store-item flex"><div class="store-item-img"><img src="' + e.storeUrl + '" alt=""></div><div class="store-item-woc"><h3 class="store-tit">' + e.storeName + '</h3><div class="store-det"><span>' + e.categoryName + '</span> | <span>人气' + e.sentiment + '</span></div><p class="store-add">' + e.address + '</p></div></div></a>'
                        } else {
                            str += '<a href="detail.html?storeId=' + e.storeId + '"><div class="store-item flex"><div class="store-item-img"><img src="' + e.storeUrl + '" alt=""></div><div class="store-item-woc"><h3 class="store-tit">' + e.storeName + '</h3><div class="store-det"><span> </span> | <span>人气' + e.sentiment + '</span></div><p class="store-add">' + e.address + '</p></div></div></a>'
                        }
                    })
                    cursor++; //页数
                    if (page > 1) {
                        $(".bus-store").append(str);
                    } else {
                        $(".bus-store").html(str);
                    }
                    $(".noPic").hide()
                    $(".weui-cells__titleno").hide()
                } else {
                    if (page > 1) {
                        $(".weui-cells__title").addClass("show-more")
                    } else {
                        $(".noPic").show()
                        $(".weui-cells__titleno").show()
                    }
                    loading = true;
                }
                $(".weui-loadmore").hide();
            }
        });
    }
})