requirejs.config({
    baseUrl: "../js/",
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
    let openid = localStorage.getItem("openid")
    ajs.showLoading("加载中");
    $.ajax({
        url: public.baseUrl + "/api/third/Mall/withdraw/record",//接口zy
        method: "POST",
        data: {
            timestamp: "121",
            deviceId: "1",
            appVersion: "1",
            deviceType: "1",
            phoneSystemVersion: "1",
            openId: openid,
            cursor: "1"
        },
        dataType: "json",
        success: function (res) {
            ajs.hideLoading();
            console.log("提现记录", res)
            if (res.code == 200) {
                if (res.data.data.length > 0) {
                    let info = res.data.data
                    let str = "";
                    $.each(info, function (i, e) {
                        switch (e.status) {
                            case 1: str += '<section class="trade"><div class="trade-top flex_bet"><p class="Ttop-l">提现-' + e.bankName + ' （' + e.bankNo + '）</p><h4>￥' + e.amount + '</h4></div><div class="trade-bot flex_bet"><div class="Tbot-l flex"><img src="../img/trade-t.png" alt="">' + e.createTime + '</div><p class="Tbot-r">' + "提现成功" + '</p></div></section>'
                                break;
                            case 2: str += '<section class="trade"><div class="trade-top flex_bet"><p class="Ttop-l">提现-' + e.bankName + ' （' + e.bankNo + '）</p><h4>￥' + e.amount + '</h4></div><div class="trade-bot flex_bet"><div class="Tbot-l flex"><img src="../img/trade-t.png" alt="">' + e.createTime + '</div><p class="Tbot-r">' + "正在处理" + '</p></div></section>'
                                break;
                            case 3: str += '<section class="trade"><div class="trade-top flex_bet"><p class="Ttop-l">提现-' + e.bankName + ' （' + e.bankNo + '）</p><h4>￥' + e.amount + '</h4></div><div class="trade-bot flex_bet"><div class="Tbot-l flex"><img src="../img/trade-t.png" alt="">' + e.createTime + '</div><p class="Tbot-r Tfile">' + "提现失败" + '</p></div></section>'
                                break;
                        }
                    })
                    $("body").html(str)
                } else {
                    $(".hideBox").show()
                }

            } else {
                ajs.showToast({
                    content: "网络异常",
                    type: "fail"
                });
            }
        }
    })
})