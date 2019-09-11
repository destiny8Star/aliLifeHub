requirejs.config({
    baseUrl: "../js/",
    paths: {
        "flex": "apps/flexible",
        "public": "apps/public",
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
requirejs(["jquery", "wui", "flex", "ajs", "public", ], function ($, wui, flex, ajs, public) {
    //点击上面
    $(".sel-tit").click(function () {
        let index = $(this).index()
        console.log("top", index, $(".selCont").eq(index))
        $(this).addClass("selTit").siblings().removeClass("selTit") //改变样式
        $(".selCont").hide().eq(index).show()
    })

    // 点击选项
    $(".selCont").on("click", ".Sprovince", function () {
        let tit = $(this).text()
        let cityId = $(this).data("id")
        console.log("点击了", cityId)
        $(".Tprovince").text(tit)
        $(".Sprovince").removeClass("sel").children("img").removeClass("sel") //去掉样式
        $(this).addClass("sel").children("img").addClass("sel") //添加样式，显示对勾
        $(".Tcity").text("请选择").removeClass("titHide").addClass("selTit").siblings().removeClass("selTit") //给头部修改样式
        $(".Tarea").text("请选择")
        $(".sel-btn").hide()
        let datas = {
            cityId: cityId, //默认的
            timestamp: "121",
            deviceId: "1",
            appVersion: "1",
            deviceType: "1",
            phoneSystemVersion: "1",
        }
        getData(datas, callBack, "Scity", 1) //调用获取2级的
    })

    $(".selCont").on("click", ".Scity", function () {
        let tit = $(this).text()
        let cityId = $(this).data("id")
        $(".Tcity").text(tit)
        $(this).siblings().removeClass("sel").children("img").removeClass("sel") //去掉样式
        $(this).addClass("sel").children("img").addClass("sel") //添加样式，显示对勾
        $(".Tarea").text("请选择").removeClass("titHide").addClass("selTit").siblings().removeClass("selTit") //给头部修改样式
        $(".sel-btn").hide()
        // callBack(area, "Sarea", 2)
        let datas = {
            cityId: cityId, //默认的
            timestamp: "121",
            deviceId: "1",
            appVersion: "1",
            deviceType: "1",
            phoneSystemVersion: "1",
        }
        getData(datas, callBack, "Sarea", 2) //调用获取3级的
    })
    $(".selCont").on("click", ".Sarea", function () {
        let tit = $(this).text()
        $(".Tarea").text(tit)
        $(this).siblings().removeClass("sel").children("img").removeClass("sel") //去掉样式
        $(this).addClass("sel").children("img").addClass("sel") //添加样式，显示对勾
        $(".sel-btn").show()
    })
    //获取省市区
    function getData(data, callBack, clName, ind) {
        ajs.showLoading("加载中")
        $.ajax({
            url: public.baseUrl + "/api/third/Mall/parentId",
            data: data,
            method: "POST",
            dataType: "json",
            success: function (res) {
                ajs.hideLoading()
            
                if (res.code == 200) {
                    callBack(res.data, clName, ind)
                } else {
                    ajs.showToast({
                        content: "网络异常",
                        type: "fail"
                    });
                }
            }
        })
    }
    let getC = {
        cityId: 10000000, //默认的
        timestamp: "121",
        deviceId: "1",
        appVersion: "1",
        deviceType: "1",
        phoneSystemVersion: "1",
    }
    getData(getC, callBack, "Sprovince", 0) //调用获取一级的
    //获取信息回调处理
    function callBack(data, clName, ind) {
        let str = ""
        data.forEach(function (e, i) {
            str += "<div class='selCont-item " + clName + "' data-id=" + e.cityId + ">" + e.cityName + "<img src='../img/G.png' alt='' class='sel-img'></div>"
        })
        $(".selCont").hide().eq(ind).html(str).show()
    }
    $(".sel-btn").click(function () {
        let pro = $(".Tprovince").text()
        let cit = $(".Tcity").text()
        let are = $(".Tarea").text()
        console.log("pro", pro)
        if (pro == "请选择" || cit == "请选择" || are == "请选择") return
        let data = {
            province: pro,
            city: cit,
            district: are
        }
        let city = JSON.stringify(data)
        localStorage.setItem("city", city)
        history.back()
    })
})