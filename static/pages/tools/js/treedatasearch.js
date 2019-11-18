// 以下方法加到自定义方法中，用事件触发treeSearch
// 树搜索
treeSearch(){
    let treeData = this.DragTree1.data;//树的原始数据
    let searchKey = this.Input1.value;//搜索关键字
    let dataTemp = JSON.parse(JSON.stringify(treeData));//深拷贝，别人是这么说的
    console.log(dataTemp);
    this.DragTree1.data = this.filterTreeNode(dataTemp, searchKey);//TODO每次搜索重置树的数据，不然不正常
},
filterTreeNode(tree, searchKey){
    let newTree = tree.filter(node => {
        node.children = this.filterTreeNode(node.children, searchKey)
        if (node.children.length > 0) {
            return true
        }
        let is_has = this.checkFilterMapping(node, searchKey)
        return is_has
    });
    return newTree
},

checkFilterMapping(originVal, checkVal) {
    let has_name = false;
    let has_code = false;
    let has_handler = false;
    if (originVal.name) {
        has_name = originVal.name.toLowerCase().indexOf(checkVal.toLowerCase()) > -1
    }
    if (originVal.code) {
        has_code = originVal.code.indexOf(checkVal) > -1
    }
    if (originVal.handler) {
        has_handler = originVal.handler.indexOf(checkVal) > -1
    }
    return has_name || has_code || has_handler
}, 