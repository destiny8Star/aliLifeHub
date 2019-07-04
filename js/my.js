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
requirejs(["jquery", "wui", "flex", "ajs", "public", "swx"], function ($, wui, flex, ajs, public, swx){
    //判断是否返回页面
    ajs.onPageResume(function () {
        window.location.reload();
    });

    let openid = localStorage.getItem("openid")
    //判断是否绑定 0未绑定,1绑定
    ajs.showLoading("加载中");
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
                    if (res.data == 1) {
                        getInfo()
                    } else {
                        $(".mask").show()
                    }
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

    $(".toBind").click(function () {
        ajs.pushWindow("/my/bindPhone.html?storeUserId=0")
    })
    //获取信息
    function getInfo() {
        $.ajax({
            url: public.baseUrl + "/api/third/Mall/home",//zy接口
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
                ajs.hideLoading();
                console.log("获取信息", res)
                if (res.code == 200) {
                    let info = JSON.stringify(res.data)
                    localStorage.setItem("myInfo", info)
                    changeDom(res.data)
                } else {
                    ajs.showToast({
                        content: "网络异常",
                        type: "fail"
                    });
                }
            }
        })
    }
    function changeDom(data) {
        let str = ""
        $("h4").text(data.nickName)
        $("h5").eq(0).text(data.cumulativeMoney)
        $("h5").eq(1).text(data.balance)
        $(".headpic").attr({ src: data.photoUrl || "img/toux.png" })
        switch (data.level) {
            case 0: $(".my-top-tit-type").html('普通用户<img src="img/xingxing.png" alt="">');
                break;
            case 1: $(".my-top-tit-type").html('PLUS会员<img src="img/vip.png" alt="">');
                break;
            case 2: $(".my-top-tit-type").html('执行服务商<img src="img/zuanshi.png" alt="">');
                break;
            case 3: $(".my-top-tit-type").html('区域服务商<img src="img/huangguan.png" alt="">');
                break;
            case 4: $(".my-top-tit-type").html('城市服务商<img src="img/huangguan.png" alt="">');
                break;
        }
    }
    //请下载app
    $(".my-top-bot").click(function () {
        ajs.showToast({
            content: "请下载APP查看",
            type: "fail"
        });
    })
})