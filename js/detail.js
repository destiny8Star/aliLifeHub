requirejs.config({
    baseUrl: "../js/",
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
requirejs(["jquery", "wui", "flex", "ajs", "public", "swx"], function ($, wui, flex, ajs, public, swx) {
    //获取storeId
    let storeId = public.getUrlParms("storeId")
    console.log("store", storeId)
    var shopInfo;
    ajs.showLoading("加载中");
    //获取信息
    $.ajax({
        url: public.baseUrl + "/api/third/Mall/storeId",//zy接口
        type: "POST",
        data: {
            storeId: storeId,
            timestamp: "121",
            deviceId: "1",
            appVersion: "1",
            deviceType: "1",
            phoneSystemVersion: "1",
        },
        dataType: "json",
        success: function (res) {
            ajs.hideLoading();
            console.log("res", res)
            let str = ""
            if (res.code == 200) {
                shopInfo = res.data
                $("h3").text(shopInfo.storeName)
                $.each(shopInfo.pic, function (i, e) {
                    str += '<img src="' + e + '" alt="">'
                })
                //    $(".phone").attr({href:"tel:"+shopInfo.mobile+"#mp.weixin.qq.com"})
                if (shopInfo.mobile) {
                    $(".phone").attr({ href: "tel:" + shopInfo.mobile })
                } else {
                    $(".phone").hide()
                }

                $("span").text(shopInfo.address)
                $(".pic").html(str)
                $(".toPay").attr({ href: "payment.html?storeId=" + shopInfo.storeId })
            }
        }
    })
    //获取jssdk权限
    // let wxList = ["openLocation"]
    // getconfig(timestamp, nonceStr, wxList)
    $(".add-left").click(function () {
        console.log("shopinfo", shopInfo)
        // wx.openLocation({
        //     latitude: Number(shopInfo.locationY), // 纬度，浮点数，范围为90 ~ -90
        //     longitude: Number(shopInfo.locationX), // 经度，浮点数，范围为180 ~ -180。
        //     name: shopInfo.storeName, // 位置名
        //     address: shopInfo.address, // 地址详情说明
        //     scale: 18, // 地图缩放级别,整形值,范围从1~28。默认为最大
        //     infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        // });
        ajs.openLocation({
            longitude: Number(shopInfo.locationY),
            latitude: Number(shopInfo.locationX),
            name: shopInfo.storeName,
            address: shopInfo.address
        });
    })


})