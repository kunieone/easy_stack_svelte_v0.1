<script lang="ts">
  import { crossfade, fade } from "svelte/transition";
  import { flip } from "svelte/animate";
  type Item = {
    id: number;
    value: string;
  };
  let arr: Item[] = [
    { id: 0, value: "Javascript" },
    { id: 1, value: "Svelte" },
    { id: 2, value: "Flutter" },
    { id: 3, value: "React" },
    { id: 4, value: "Angular" },
    { id: 5, value: "Vue" },
  ];

  let selected = [];
  function handleClick(tag: Item) {
    if (!selected.includes(tag.id)) {
      selected = [...selected, tag.id];
    } else {
      selected = selected.filter((e) => e !== tag.id);
    }
    console.log(selected);
  }
  const [send, receive] = crossfade({
    duration: (d) => Math.sqrt(d * 125),
    fallback: fade,
  });

  const toUid = (str: string) => {
    let re = 0;
    for (let i = 0; i < str.length; i++) {
      let asciiCode = str.charCodeAt(i);
      re += asciiCode * i;
    }
    return re;
  };
</script>

<main>
  <h1>All</h1>
  {#each arr.filter((ee) => !selected.includes(ee.id)) as e (e.id)}
    <!-- content here -->
    <button
      animate:flip={{ duration: 200 }}
      in:receive={{ key: e.id }}
      out:send={{ key: e.id }}
      class="tag"
      on:click={() => handleClick(e)}>{e.value}</button
    >
  {/each}
  <h1>Selected</h1>
  {#each arr.filter((ee) => selected.includes(ee.id)) as e (e.id)}
    <!-- content here -->
    <button
      animate:flip={{ duration: 200 }}
      in:receive={{ key: e.id }}
      out:send={{ key: e.id }}
      class="tag"
      on:click={() => handleClick(e)}>{e.value}--</button
    >
  {/each}
</main>

<style>
  .tag {
    margin: 20px;
    display: inline-block;
  }
</style>
