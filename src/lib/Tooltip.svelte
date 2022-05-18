<script>
  import "boxicons";
  export let title = "title";
  export let explain = "explain";
</script>

<main>
  {title}={explain}
  <i class="dianzan bx bxs-like bx-spin" />
</main>

<style lang="less">
  @import url("https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css");
  [rocket] {
    color: aquamarine;
  }
  main {
    display: grid;
    place-items: center;
    height: 100vh;
  }
  .tooltip {
    border-radius: 50px;
    height: 50px;
    display: grid;
    place-items: center;
    width: 50px;
    border: 3px solid black;
  }
</style>
