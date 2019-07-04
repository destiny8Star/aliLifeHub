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
requirejs(["jquery", "wui", "flex",  "public"], function ($, wui, flex, public){
    //获取缓存记录
    let serchWoc = localStorage.getItem("serchWoc")
    if (serchWoc) {
        console.log("历史记录大盒子", serchWoc)
        serchWoc = JSON.parse(serchWoc)
        let str = ''
        serchWoc.forEach(function (e, i) {
            str += '<p class="item">' + e + '</p>'
        })
        $(".hisWoc").html(str)
    } else {
        serchWoc = []
    }

    //点击搜索
    $("span").click(function () {
        toSearch()
    })
    //点击键盘搜索
    $(".inputs").on('keypress', function (e) {
        var keycode = e.keyCode;
        if (keycode == '13') {
            toSearch()
        }
    });

    //点击历史搜索
    $("p").click(function () {
        let val = $(this).text()
        val = encodeURI(encodeURI(val))
        location.href = "/business/busList.html?storeName=" + val
    })
    //搜索方法
    function toSearch() {
        let val = $("input").val()
        if (val) {
            if (!serchWoc.includes(val)) {//如果不存在
                if (serchWoc.length < 10) {
                    serchWoc.unshift(val)
                } else {
                    serchWoc.pop()
                    serchWoc.unshift(val)
                }
            }
            localStorage.setItem("serchWoc", JSON.stringify(serchWoc))
            val = encodeURI(encodeURI(val))
            location.href = "/business/busList.html?storeName=" + val
        } else {
            ajs.showToast({
                content: "请输入内容",
                type: "fail"
            });
        }
    } 
})