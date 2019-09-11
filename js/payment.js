requirejs.config({
    baseUrl:"../js/",
    paths:{
        "flex": "apps/flexible",
        "public":"apps/public",
        "swx":"apps/setWx-config",
        "jquery": "https://code.jquery.com/jquery-3.2.1.min",
        "wui": "https://cdn.bootcss.com/jquery-weui/1.2.1/js/jquery-weui.min",
        "ajs": "https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min"
    },
    shim:{
        "wui": {
            deps: ['jquery'],
        },
    }
})
requirejs(["jquery", "wui", "flex", "ajs", "public","swx"], function ($,  wui, flex, ajs, public,swx){

    let timestamp2 = public.getTimes()
    var inprice;//输入金额
    var price; //实际支付金额
    $(".m-input").val("")

 
    //获取地址栏参数
    var auth_code = public.getUrlParms("auth_code");
    let openid = localStorage.getItem("openid");
    if (!openid) {
        swx.authorize(auth_code, timestamp2)
        openid = localStorage.getItem("openid");
    }
    var storeId = public.getUrlParms("storeId"); //从地址栏获取storeid
    console.log("openid", openid, storeId)

    //进入页面获取storeid；
    let isF=true; //只重新授权一次，因为code只能用一次
    swx.getShopInfo(openid, storeId, timestamp2, auth_code,isF)
    //输入金额
    $(".m-input").keyup(function() {
        console.log($(this).val())
        // inprice = NumberCheck($(this).val())
        // $(this).val(inprice)
            let inpn = $(this).val()
            if (inpn.length > 9) {
                $(this).val(inpn.slice(0, 9))
            }
            inprice=$(this).val()
            if(inprice.indexOf(".")!=-1){
                let len = inprice.substr(inprice.indexOf(".")+1)
                console.log("Aaaa",len.length)
                if(len.length>2){
                      inprice =""
                      $(this).val("") 
                }
            }
            let btprice = Math.floor(inprice * discount) / 100
            price = price = ((inprice * 1000 - btprice * 1000) / 1000).toFixed(2)
            $(".bt-riq").text("-￥" + btprice)
            $(".bt-ris").text("￥" + price)
            $(".zf-mon").text(price)
            console.log("pice", inprice, btprice, price)

        })
    //确认支付
    $(".weui-btn").click(function() {
        if (!inprice || inprice < 0.01) return
        if(inprice<0.1){
            ajs.showToast({
                content: "最小金额为0.1元",
                type: "fail",
            });
            return 
        }
        location.href = "selPay.html?inp=" + inprice + "&price=" + price + "&storeId=" + storeId
    })
})