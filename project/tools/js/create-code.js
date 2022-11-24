var inputList = undefined;
var inputE = undefined;
var inputListLen = 2;

$(function () {
    inputList = $(".inputList");

    $("#inputLen").val(inputListLen);
    LoadInputList();

    //输入参数数量事件
    $("#inputLen").on("input propertychange", function () {
        inputListLen = $("#inputLen").val()
        if (inputListLen < 1) {
            return;
        }
        LoadInputList();
    });

    inputE = $("#ccinput");

    inputE.keyup(function () {//输入事件
        rp();
    });
    rp();
});




function LoadInputList() {//加载输入列表
    inputList.html("")
    for (var i = 0; i < inputListLen; i++) {
        var input = $("<li>").append("参数{#" + i + "} : ",
            $("<input>").attr({
                id: "ip" + i
            }).val("c" + i + "-1,c" + i + "-2")
        );
        input.keyup(function () {
            rp();
        })
        inputList.append(input);
    }
}




function rp() {//替换
    var op = $("#ccoutput");
    op.val("");
    var ipval = inputE.val();

    var inputListObj = new Array();
    for (var i = 0; i < inputListLen; i++) {
        inputListObj.push($("#ip" + i).val().split(","))
    }

    for (var index in inputListObj[0]) {
        var nTemp = ipval;
        for (var i = 0; i < inputListLen; i++) {
            var inputTemp = inputListObj[i];
            if (inputTemp.length > index) {
                var pattern = new RegExp("\{#" + i + "\}", "g");
                nTemp = nTemp.replace(pattern, inputTemp[index]);
            }
        }
        op.val(op.val() + nTemp);
    }
}
