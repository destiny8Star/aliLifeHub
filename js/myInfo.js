requirejs.config({
    baseUrl: "../js/",
    paths: {
        "flex": "apps/flexible",
        "public": "apps/public",
        "swx": "apps/setWx-config",
        "clip":"libs/clipboard.min",
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
requirejs(["jquery", "wui", "flex", "ajs", "public", "swx","clip"], function ($, wui, flex, ajs, public, swx,clip){
    //获取信息
    let info = localStorage.getItem("myInfo")
    let openid = localStorage.getItem("openid")
    info = JSON.parse(info)
    console.log("信息", info, $("span"))
    $(".headImg").attr({ src: info.photoUrl || "../img/toux.png" })
    $("span").eq(1).text(info.nickName)
    $("span").eq(2).text(info.account)
    $("span").eq(4).text(info.isRealName == "0" ? "未实名" : "已实名")
    $("span").eq(5).text(info.myInvitation)
    switch (info.level) {
        case 0: $("span").eq(0).text("普通用户")
            break;
        case 1: $("span").eq(0).text("PLUSE会员")
            break;
        case 2: $("span").eq(0).text("执行服务商")
            break;
        case 3: $("span").eq(0).text("区域服务商")
            break;
        case 4: $("span").eq(0).text("城市服务商")
            break;
    }
    //复制
    var clipboard = new clip('.copy');
    clipboard.on('success', function (e) {
        ajs.showToast({
            content: "复制成功",
            type: "success"
        });
        e.clearSelection();
    });
    //获取我的邀请人
    $.ajax({
        url: public.baseUrl + "/api/third/Mall/profile",
        method: "POST",
        data: {
            timestamp: "121",
            deviceId: "1",
            appVersion: "1",
            deviceType: "1",
            phoneSystemVersion: "1",
            openId: openid
        },
        dataType: "json",
        success: function (res) {
            console.log("获取信息", res)
            if (res.code == 200) {
                $("span").eq(5).text(res.data.myInvitation)
            } else {
                ajs.showToast({
                    content: "网络异常",
                    type: "fail"
                });
            }
        }
    })

})