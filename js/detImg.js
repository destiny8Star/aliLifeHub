requirejs.config({
    baseUrl: "../js/",
    paths: {
        "flex": "apps/flexible",
        "public": "apps/public",
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
requirejs(["jquery", "wui", "flex", "ajs", "public"], function ($, wui, flex, ajs, public) {
    var page = 2;//页数
    var flag = true;//判断是否请求数据
    let last = 0 //初始上一个长度；
    let len = 0  //初始下一个长度
    let storeId = public.getUrlParms("storeId")
    let tops;
    let hei = document.documentElement.clientHeight
    getImg(1)//进入页面请求数据
    //获取信息
    function getImg(page) {
        ajs.showLoading("加载中")
        $.ajax({
            url: public.baseUrl + "/api/third/Mall/storeId/pic",//zy接口
            type: "POST",
            data: {
                storeId: storeId,
                timestamp: "121",
                deviceId: "1",
                appVersion: "1",
                deviceType: "1",
                phoneSystemVersion: "1",
                cursor: page,
                size: 21
            },
            dataType: "json",
            success: function (res) {
                ajs.hideLoading();
                console.log("res", res)
                let str = ""
                if (res.code == 200) {
                    if (res.data.data.length >= 0) {
                        //   page+=1  在滚动时候无法获取到
                        $.each(res.data.data, function (i, e) {
                            str += ' <img src="' + e + '" alt="" class="item">'
                            // str += ' <img src="../img/DW.png" alt="" class="item">'
                        })
                        $(".imgbox").append(str)
                        tops = $(".shim").offset().top
                        //    console.log("add", tops, hei,page)

                    } else {
                        flag = false
                        ajs.showToast({
                            content: "无更多数据",
                            type: "fail"
                        });
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

    $(window).scroll(page, function () {
        let go = $(document.documentElement).scrollTop()
        if (hei + go >= tops && flag) {
            getImg(page)
            page++
            last = len
            len = $(".item").length
            if (len == last) {
                flag = false
            }
        }
    })
    //图片放大
    $(".imgbox").on("click", ".item", function () {
        let src = $(this).attr("src")
        $(".mask").show()
        $(".hei").attr("src", src)
    })
    $(".mask").click(function () {
        $(this).hide()
    })
})