export default class Game {
  #data = { gameArr: [] };
  constructor() {
    this.init();
    /* 一开始先生成一个 */
    this.fill();
  }
  /* 一开始从数组里生成一些数字。 */
  #getVacancyE() {
    let pool = [];
    this.#scan((e, element) => {
      if (element === 0) {
        pool.push(e);
      }
    });
    return pool;
  }
  #scan(cb) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let e = i * 4 + j;
        let row = i;
        let col = j;
        let returnValue = cb(e, this.#data.gameArr[row][col], row, col);
        if (returnValue === undefined) {
          returnValue === 1;
        }
        if (returnValue) break;
      }
    }
  }

  getGamePad() {
    return this.#data.gameArr;
  }
  gen() {
    /* 从非零的位置中随机生成1或2 */
    let result = [];
    let [getRandom, times] = [
      () => (~~(Math.random() * 2) + 1) * 2,
      [1, 2].sort(() => Math.random() - 0.5)[0],
    ]; /* randoms{2,4} */
    // let times = [1, 2].sort(() => Math.random() - 0.5)[0];
    while (times) {
      times--;
      result.push(getRandom());
    }
    return result;
  }
  fillWhichE(e, v) {
    /* 对应的索引填入某个数 */
    let row = ~~(e / 4);
    let col = e % 4;
    // console.log(v, row, col)
    this.#data.gameArr[row][col] = v;
  }

  fill() {
    /* 每一次移动都会调用一次fill生成新的数字 */
    let e = this.#getVacancyE().sort(
      (e) => Math.random() - 0.5,
    )[0]; /* 零值对应的e */
    let value = [2, 2, 2, 4].sort((e) => Math.random() - 0.5)[0];
    this.fillWhichE(e, value);
    let addInfo = { from: [-1, -1], to: [~~(e / 4), e % 4] };
    // console.log(addInfo)
    return addInfo;
  }
  //   左边是空的 ==>return true
  /* 从前到后扫描 */

  /* 翻折 */
  turn(forforArr, flag) {
    // flag=='h'||'v' horizonal ||vertical
    // flag = 'v' /* vertical */
    let temp = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (flag === "v") temp[3 - i][j] = forforArr[i][j];
        if (flag === "h") temp[i][3 - j] = forforArr[i][j];
      }
    }
    return temp;
  }
  collapseOneRow(arr, globalI) {
    let re = [],
      motion = [],
      locked = -1;
    /* 如果已经合成，那么开启🔒
      比如  [2,2,4,8]
      如果不开启，将会一次性全部合成
      */
    arr.forEach((e, i) => {
      if (
        re[re.length - 1] === e &&
        i !== re.length - 1 &&
        re.length - 1 !== locked
      ) {
        // console.log({ i, locked })
        motion.push({ from: [globalI, i], to: [globalI, re.length - 1] });
        re.pop();
        re.push(2 * e);
        locked = re.length - 1;
        /* 合成 */
      } else if (e !== 0) {
        re.push(e);
        if (i !== re.length - 1)
          motion.push({ from: [globalI, i], to: [globalI, re.length - 1] });
      }
    });
    let count = 1;
    while (count) {
      if (re.length === 4) break;
      if (re.length < 4) re.push(0);
    }
    return { re, motion };
  }

  collapse(dir /* 方向 v,h,l,r*/) {
    let e = [];
    let control = [];
    e = this.#data.gameArr.map((e, globalI) => {
      let result = this.collapseOneRow(e, globalI);
      control.push(result.motion);
      return result.re;
    });
    this.#data.gameArr = e;
    return control.flat();
  }

  rotate(forforArr, flag) {
    let temp = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (flag === "l" || flag === undefined)
          temp[3 - j][i] = forforArr[i][j];
        if (flag === "r") temp[j][3 - i] = forforArr[i][j];
      }
    }
    return temp;
  }

  leftRotate(arr) {
    // arr[0]   arr[1]
    let copy = JSON.parse(JSON.stringify(arr));
    arr[0] = 3 - copy[1];
    arr[1] = copy[0];
    return arr;
  }
  rightRotate(arr) {
    let copy = JSON.parse(JSON.stringify(arr));
    arr[0] = copy[1];
    arr[1] = 3 - copy[0];
    return arr;
  }

  /* 把旋转对应的坐标恢复 */
  rightMotionRotate(motions) {
    motions.forEach((e) => {
      e.from = this.rightRotate(e.from);
      e.to = this.rightRotate(e.to);
    });
    return motions;
  }

  leftMotionRotate(motions) {
    motions.forEach((e) => {
      e.from = this.leftRotate(e.from);
      e.to = this.leftRotate(e.to);
    });
    return motions;
  }
  /* 模拟四个方向的操作 */
  mockTop() {
    console.log(`===top===`);
    /* 向上滑⬆️ */
    // top: rotate(l) ->collapse() ->recovermotions
    this.#data.gameArr = this.rotate(this.#data.gameArr, "l");
    let motions = this.collapse();
    this.rightMotionRotate(motions);
    this.#data.gameArr = this.rotate(this.#data.gameArr, "r");
    if (motions.length !== 0) motions.push(this.fill());
    console.log(motions);
    return {
      updated: this.#data.gameArr,
      motions,
    };
  }

  mockLeft() {
    console.log(`===left===`);

    /* 向左边滑 */
    let motions = this.collapse();
    if (motions.length !== 0) motions.push(this.fill()); /* 生成新数字 */
    console.log(motions);

    return {
      updated: this.#data.gameArr,
      motions,
    };
  }
  mockDown() {
    console.log(`===down===`);
    /* 向下边滑 */
    this.#data.gameArr = this.rotate(this.#data.gameArr, "r");
    let motions = this.collapse();
    this.leftMotionRotate(motions);
    this.#data.gameArr = this.rotate(this.#data.gameArr, "l");
    if (motions.length !== 0) motions.push(this.fill());
    console.log(motions);
    return {
      updated: this.#data.gameArr,
      motions,
    };
  }
  mockRight() {
    console.log(`===right===`);
    /* 向右边滑 */
    this.#data.gameArr = this.rotate(this.#data.gameArr, "r");
    this.#data.gameArr = this.rotate(this.#data.gameArr, "r");
    let motions = this.collapse();
    this.rightMotionRotate(motions);
    this.rightMotionRotate(motions);

    this.#data.gameArr = this.rotate(this.#data.gameArr, "l");
    this.#data.gameArr = this.rotate(this.#data.gameArr, "l");
    if (motions.length !== 0) motions.push(this.fill());
    console.log(motions);

    return {
      updated: this.#data.gameArr,
      motions,
    };
  }

  init() {
    this.#data.gameArr = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }
  changeUnit(arr) {
    this.#data.gameArr = arr;
  }
  printIt(arr) {
    for (let i = 0; i < 4; i++) {
      console.log(
        "[" +
          `${arr === undefined ? this.#data.gameArr[i] : arr[i]}`.toString() +
          "],",
      );
    }
  }
}
