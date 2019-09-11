requirejs.config({
    baseUrl: "../js/",
    paths: {
        "flex": "apps/flexible",
        "public": "apps/public",
        "jquery": "https://code.jquery.com/jquery-3.2.1.min",
        "wui": "https://cdn.bootcss.com/jquery-weui/1.2.1/js/jquery-weui.min",
        "ajs": "https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min",
        "clip": "libs/clipboard.min",
    },
    shim: {
        "wui": {
            deps: ['jquery'],
        },
    }
})
requirejs(["jquery", "wui", "flex", "ajs", "public", "clip"], function ($, wui, flex, ajs, public, clip) {
    //获取storeId
    let storeId = public.getUrlParms("storeId")
    var address = JSON.parse(localStorage.getItem("address")) //获取经纬度
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
            longitude: address.longitude,
            latitude: address.latitude
        },
        dataType: "json",
        success: function (res) {
            ajs.hideLoading();
            console.log("res", res)
            let str = ""
            if (res.code == 200) {
                shopInfo = res.data
                $("h3").text(shopInfo.storeName)
                $(".per").text(shopInfo.discount)
                $(".napo-tit").text(shopInfo.categoryName)
                $(".napo-po").text("销量" + shopInfo.sentiment)
                let ads = shopInfo.address + ' |<span class= "add-dis">  距您 <span class= "add-dis-num"> ' + shopInfo.distance + '</span></span>'
                $(".add-detail").html(ads)
                $(".pic-num").text(shopInfo.picNum)
                $.each(shopInfo.pic, function (i, e) {
                    str += '<div class="pic-item"><img src="' + e + '" alt=""></div>'
                })
                if (shopInfo.picNum > 3) {
                    str += ' <a href="detImg.html?storeId=' + shopInfo.storeId + '"><div class="pic-more">查看全部<span class="pic-num">(' + shopInfo.picNum + ')</span>张</div></a>'
                }
                if (!shopInfo.mobile) {
                    // $(".phone").attr({ href: "tel:" + shopInfo.mobile })
                    $(".add-right").hide()
                } 
                
                $(".pic").html(str)
                $(".toPay").attr({ href: "payment.html?storeId=" + shopInfo.storeId })
            }
        }
    })
    $(".add-right").click(function(){
        let type = public.detect();
        if(type=="ios"){
           window.location.href = "tel:"+shopInfo.mobile
        }else{
            $(".maskphone").text(shopInfo.mobile)
            $(".mask").show()
           
            // ajs.confirm({
            //     title: '温馨提示',
            //     content: type,
            //     confirmButtonText: '马上查询',
            //     cancelButtonText: '暂不需要'
            // });
            console.log("aaa")
        }
          
    })
    //取消
    $(".btn-c").click(function(){
        $(".mask").hide()
    })
    //复制
    $(".btn-s").click(function () {
        let clipboard = new clip('.btn-s');
        clipboard.on('success', function (e) {
            ajs.showToast({
                content: "复制成功",
                type: "success"
            });
            e.clearSelection();
        });
    })
    // //获取jssdk权限
    $(".add-left").click(function () {
        ajs.openLocation({
             latitude: Number(shopInfo.locationY),
            longitude: Number(shopInfo.locationX),
            name: shopInfo.storeName,
            address: shopInfo.address,
            scale:15
        })
    });

})