<template>
  <div :style="snakeBoxStyle">
    <li
      v-for="item in snakeArray"
      :key="item.id"
      :class="{ point: true, pointSelect: item.isSel }"
      :style="snakePointStyle"
    ></li>
  </div>
</template>

<script>
module.exports = {
  name: "snake",
  data() {
    return {
      snakeArray: new Array(),
      snakeHead: null,
      snakeBoxSize: 40,
      snakePointWidth: 10,
      snakeBoxStyle: "",
      snakePointStyle: "",
      snakeMove: 39,
      snakeEats: -1,
      snakeLen: 5,
    };
  },
  created: function () {
    var thisSnake = this;
    for (var i = 0; i < thisSnake.snakeBoxSize * thisSnake.snakeBoxSize; i++) {
      thisSnake.snakeArray.push({
        id: i,
        isSel: false,
      });
      thisSnake.snakeBoxStyle =
        "border:1px solid red;width: " +
        thisSnake.snakePointWidth * thisSnake.snakeBoxSize +
        "px;height: " +
        thisSnake.snakePointWidth * thisSnake.snakeBoxSize +
        "px;";
      thisSnake.snakePointStyle =
        "width: " +
        (thisSnake.snakePointWidth - 2) +
        "px;height: " +
        (thisSnake.snakePointWidth - 2) +
        "px;";
    }
    thisSnake.snakeHead = new thisSnake.snakeNode(0);
    for (var i = 0; i < thisSnake.snakeLen; i++) {
      thisSnake.insertNode(i);
    }
    thisSnake.newSnakeEats();
    thisSnake.listKeyDownEvent();
    setInterval(thisSnake.snakeMoving, 100);
  },
  methods: {
    snakeNode: function (idx) {
      this.pointIndex = idx;
      this.next = null;
    },
    insertNode: function (idx) {
      var thisSnake = this;
      var newNode = new thisSnake.snakeNode(idx);
      var pNode = thisSnake.snakeHead;
      var currNode = thisSnake.snakeHead;
      if (currNode.next != null) {
        newNode.next = currNode.next;
        pNode.next = newNode;
      } else {
        currNode.next = newNode;
      }
      //console.log(this.snakeHead);
    },
    showNode: function () {
      var thisSnake = this;
      var currNode = thisSnake.snakeHead;
      while (currNode.next != null) {
        currNode = currNode.next;
        //console.log(currNode.pointIndex);
        thisSnake.snakeArray[currNode.pointIndex].isSel = true;
      }
    },
    removeNode: function () {
      var thisSnake = this;
      var currNode = thisSnake.snakeHead;
      var frontNode = currNode;
      while (currNode.next != null) {
        frontNode = currNode;
        currNode = currNode.next;
      }
      if (frontNode != this.snakeHead) {
        var pointIndex = frontNode.next.pointIndex;
        frontNode.next = null;
        thisSnake.snakeArray[pointIndex].isSel = false;
      }
    },
    snakeMoving: function () {
      var thisSnake = this;
      if (this.snakeEats != -1) {
        thisSnake.snakeArray[this.snakeEats].isSel = true;
      }

      var index = thisSnake.snakeHead.next.pointIndex;
      switch (this.snakeMove) {
        case 37:
          if (index % thisSnake.snakeBoxSize == 0) {
            index = index + thisSnake.snakeBoxSize - 1;
          } else {
            index--;
          }
          break;
        case 38:
          if (index - thisSnake.snakeBoxSize < 0) {
            index =
              thisSnake.snakeBoxSize * thisSnake.snakeBoxSize +
              index -
              thisSnake.snakeBoxSize;
          } else {
            index -= thisSnake.snakeBoxSize;
          }
          break;
        case 39:
          if ((index + 1) % thisSnake.snakeBoxSize == 0) {
            index = index - (thisSnake.snakeBoxSize - 1);
          } else {
            index++;
          }
          break;
        case 40:
          if (
            index + thisSnake.snakeBoxSize >
            thisSnake.snakeBoxSize * thisSnake.snakeBoxSize - 1
          ) {
            index =
              index -
              thisSnake.snakeBoxSize * thisSnake.snakeBoxSize +
              thisSnake.snakeBoxSize;
          } else {
            index += thisSnake.snakeBoxSize;
          }
          break;
        default:
          break;
      }
      thisSnake.insertNode(index);
      if (thisSnake.snakeEats == index) {
        thisSnake.snakeEats = -1;
        thisSnake.newSnakeEats();
      } else {
        thisSnake.removeNode();
      }

      thisSnake.showNode();
    },
    newSnakeEats: function () {
      var thisSnake = this;
      thisSnake.snakeEats = parseInt(
        thisSnake.snakeBoxSize * thisSnake.snakeBoxSize * Math.random()
      );
    },
    listKeyDownEvent: function () {
      var thisSnake = this;
      document.onkeydown = function (e) {
        var keyCode = window.event ? e.keyCode : e.which;
        switch (keyCode) {
          case 37:
          case 39:
            if (thisSnake.snakeMove != 37 && thisSnake.snakeMove != 39) {
              thisSnake.snakeMove = keyCode;
            }
            return false;
          case 38:
          case 40:
            if (thisSnake.snakeMove != 38 && thisSnake.snakeMove != 40) {
              thisSnake.snakeMove = keyCode;
            }
            return false;
          default:
            console.log('keyCode:',keyCode);
            break;
        }
      };
    },
  },
};
</script>