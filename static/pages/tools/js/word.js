window.onload = function () {
    
    inputE = $("#ipt");

    inputE.keyup(function () {//输入事件
        change();
    });
    change();
};
function change() {
    var ipt = document.getElementById("ipt");
    var opt1 = document.getElementById("opt1");
    var opt11 = document.getElementById("opt11");
    var opt2 = document.getElementById("opt2");
    opt1.value = toFirstLowerCase(toHump(ipt.value));
    opt11.value = toFirstUpperCase(toHump(ipt.value));
    opt2.value = toLine(ipt.value);
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