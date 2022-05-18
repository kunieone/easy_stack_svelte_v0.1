<script>
  import { flip } from "svelte/animate";
  import { crossfade, fade } from "svelte/transition";
  import Game from "./Game";
  let g = new Game();
  setInterval(() => {
    g.mockLeft();
    g.mockRight();
    g.mockDown();
    g.mockRight();
    console.table(g.getGamePad());
    g = g;
  }, 1000);
  let arr = [{ value: 0 }, { value: 2 }, { value: 1 }, { value: 3 }];
  let handleButton = () => {
    arr = [{ value: 4 }, ...arr];
    [arr[2], arr[1]] = [arr[1], arr[2]];
    arr = arr;
    console.log(arr);
  };
  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 125),
    fallback: fade,
  });
</script>

<main>
  {#each g.getGamePad() as e}
    <div>
      {#each e as ee, i (i)}
        <div
          animate:flip={{ duration: 200 }}
          in:receive={{ key: e.id }}
          out:send={{ key: e.id }}
          class="box"
        >
          {ee}
        </div>
      {/each}
    </div>
  {/each}
  <button class="btn" on:click={() => handleButton()}> 移动</button>
</main>

<style>
  main {
    width: 100vw;
  }
  .box {
    display: inline-flex;
    width: 50px;
    height: 50px;
    background-color: #000;
    margin: 20px;
    font-size: 40px;
    /* display: flex; */
    justify-content: center;
    align-items: center;
    color: white;
  }
</style>
