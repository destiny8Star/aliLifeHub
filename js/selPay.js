requirejs.config({
    baseUrl:"../js/",
    paths: {
        "flex": "apps/flexible",
        "public": "apps/public",
        "swx": "apps/setWx-config",
        "jquery": "https://code.jquery.com/jquery-3.2.1.min",
        "wui": "https://cdn.bootcss.com/jquery-weui/1.2.1/js/jquery-weui.min",
        "ajs": "https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min",
    },
    shim: {
        "wui": {
            deps: ['jquery'],
        },
       
    }
})
requirejs(["jquery", "wui", "flex", "ajs", "public", "swx"], function ($, wui, flex, ajs, public, swx){
    //进页面让输入框为空
    let timestamp2 = public.getTimes()
    var info; //获取绑定信息
    var inp = Number(public.getUrlParms("inp")); //输入的金额
    var price = Number(public.getUrlParms("price")); //输入的要抵扣的金额
    $("h1").text(price)
    //获取地址栏参数
    let openid = localStorage.getItem("openid");
    var storeId = public.getUrlParms("storeId"); //从地址栏获取storeid
    var storeUserId; //定义获取商铺id
    console.log("openid", openid, storeId, inp)
    //进入页面获取storeid；
    function getShopInfo2(openid, storeId, timestamp2) {
        ajs.showLoading("数据加载中")
        $.ajax({
            url: public.baseUrl + "/api/thirdStore/payeeParam",
            method: "POST",
            data: {
                openid: openid,
                storeId: storeId,
                timestamp: timestamp2,
                deviceType: "3"
            },
            dataType: "json",
            success: function (res) {
                ajs.hideLoading();
                console.log(res)
                if (res.code == 200) {
                    info = res.data
                    storeUserId = info.storeUserId
                    $(".selTop-tit").text('点击生活-' + info.storeName)
                } else {
                    ajs.showToast({
                        content: res.message,
                        type: "fail"
                    });
                }
            },
            error: function () {
                ajs.hideLoading();
                ajs.showToast({
                    content: "网络异常",
                    type: "fail"
                });
            }
        })
    }
    getShopInfo2(openid, storeId, timestamp2)
    //支付函数
    // payMethod:2微信，3余额,1支付宝
    function toPay(payMethod, price, totalPrice, storeUserId, openid, info,storeId) {
        let timestamp = public.getTimes()
        ajs.showLoading("加载中")
        $.ajax({
            url: public.baseUrl + "/api/unionpay/payee",
            // url: public.baseUrl + "/api/pay/payee",
            method: "POST",
            data: {
                payMethod: payMethod,
                price: price,
                totalPrice: totalPrice,
                storeUserId: storeUserId,
                orderType: "4",
                openid: openid,
                timestamp: timestamp,
                deviceType: "3",
                storeId: storeId
            },
            success: function (res) {
                ajs.hideLoading();
                // ajs.confirm({
                //     title: '温馨提示',
                //     content: res,
                //     confirmButtonText: '马上查询',
                //     cancelButtonText: '暂不需要'
                // });

                if (res.code == 200) {
                        // ajs.tradePay({
                        //     orderStr: res.data
                        // }, function (res) {
                        //         if (res.resultCode == 9000){
                        //             if (info.isBindUser == 1) {
                        //                 ajs.redirectTo("payEnd.html?storeId=" + storeId + "&amount=" + inp) 
                        //             } else {
                        //                 ajs.redirectTo("payEnd.html?storeUserId=" + info.storeUserId + "&storeId=" + storeId + "&amount=" + inp) 
                        //             }
                        //         }else{
                        //             ajs.showToast({
                        //                 content: "支付失败",
                        //                 type: "fail"
                        //             });
                        //         }
                        // });
                    AlipayJSBridge.call("tradePay", {
                        tradeNO: JSON.parse(res.data.pay_info).tradeNO          // 必传，此使用方式下该字段必传
                    }, function (result) {
                            if (result.resultCode == '9000') {
                                    if (info.isBindUser == 1) {
                                        ajs.redirectTo("payEnd.html?storeId=" + storeId + "&amount=" + inp) 
                                    } else {
                                        ajs.redirectTo("payEnd.html?storeUserId=" + info.storeUserId + "&storeId=" + storeId + "&amount=" + inp) 
                                    }
                            }else{
                                ajs.showToast({
                                    content: "支付失败",
                                    type: "fail",
                                });
                            }
                         
                    });
                } else {
                    ajs.showToast({
                        content:res.message,
                        type: "fail",
                    });
                }
            }
        })
    }

     //确认支付
     $(".weui-btn_zf").click(function () {
       
         toPay(1, price, inp, storeUserId, openid, info, storeId)
     })
})