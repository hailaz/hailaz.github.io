$(function(){
    $("#jsoninput").keyup(function () { //输入事件
        jsonChange();
    });
    jsonChange();
});



function jsonChange() {
    var str = $("#jsoninput").val();
    var obj = JSON.parse(str); //由JSON字符串转换为JSON对象
    $("#structoutput").val("");
    toGoStruct(obj, "data");
}

function toGoStruct(obj, structName) { //obj to go struct
    var strTemp = "type " + structName + " struct{\n";
    for (var key in obj) {
        var subObj = obj[key];
        var vType = typeof (subObj);
        var keyTemp =  toFirstUpperCase(toHump(key));//firstUpCase(key);
        if (vType == "object") {
            if (Array.isArray(subObj)) {
                strTemp = strTemp + keyTemp + " []" + keyTemp + NameTojson(key) + "\n";
                toGoStruct(subObj[0], keyTemp);
            } else {
                strTemp = strTemp + keyTemp + " " + keyTemp + NameTojson(key) + "\n";
                toGoStruct(subObj, keyTemp);
            }
        } else {
            strTemp = strTemp + keyTemp + " " + converType(vType) + NameTojson(key) + "\n"
        }
        //console.log(keyTemp,typeof(subObj), subObj);
    }
    strTemp += "}\n"
    console.log(strTemp);
    $("#structoutput").val($("#structoutput").val() + strTemp);
}

function firstUpCase(str) { //首字母大写
    return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

function NameTojson(key) { //struct 对应的json字段
    return ' `json:"' + key + '"`'
}

function converType(type) { //类型转换
    switch (type) {
        case "number":
            return "int";
        case "boolean":
            return "bool";
        default:
            return type
    }
}
// 首字母大写
function toFirstUpperCase(name) {
    return name.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    });
}

// 首字母小写
function toFirstLowerCase(name) {
    return name.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toLowerCase() + word.substring(1);
    });
}


// 下划线转换驼峰
function toHump(name) {
    return name.replace(/\_(\w)/g, function (all, letter) {
        return letter.toUpperCase();
    });
}
// 驼峰转换下划线
function toLine(name) {
    name = name.replace(/\B([A-Z])/g, "_$1").toLowerCase();
    return name.replace(/i_d/g, "id")
}
