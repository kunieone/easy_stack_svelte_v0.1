export default {
  keyDown(event, g, arr2d) {
    switch (
      event.keyCode // 获取当前按下键盘键的编码
    ) {
      case 37: // 按下左箭头键，向左移动5个像素
        g.mockLeft();
        break;
      case 39: // 按下右箭头键，向右移动5个像素
        g.mockRight();
        break;
      case 38: // 按下上箭头键，向上移动5个像素
        g.mockTop();
        break;
      case 40: // 按下下箭头键，向下移动5个像素
        g.mockDown();
        break;
    }
    arr2d = g.getGamePad();
  },
  handleRight(g, arr2d) {
    let { updated, motions } = g.mockRight();
    return updated;
  },
  handleLeft(g, arr2d) {
    let { updated, motions } = g.mockLeft();
    return updated;
  },
  handleDown(g, arr2d) {
    let { updated, motions } = g.mockDown();
    return updated;
  },
  handleUp(g, arr2d) {
    let { updated, motions } = g.mockTop();
    return updated;
  },
};
