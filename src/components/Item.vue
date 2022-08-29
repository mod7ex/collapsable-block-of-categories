<script setup lang="ts">
import { ref } from "vue";
import { Colors } from "../utils";

const props = withDefaults(defineProps<{ uncategorized?: boolean; title: string; note: string; content: string; dots?: Colors[] | undefined; collapsable?: boolean; modelValue?: boolean }>(), {
  collapsable: false,
  title: "",
  note: "",
  content: "",
  dots: undefined,
  modelValue: true,
  uncategorized: false,
});

const emit = defineEmits(["update:modelValue"]);

const flipArrow = (e: MouseEvent) => {
  emit("update:modelValue", !props.modelValue);
  (e.currentTarget as HTMLButtonElement).classList.toggle("down");
};
</script>

<template>
  <div>
    <div class="collapse-item" v-if="!uncategorized">
      <button :class="['collapse raw-btn', modelValue ? 'down' : '']" @click="flipArrow" v-if="collapsable">
        <img src="../assets/svg/collapse-up.svg" alt="collapse" />
      </button>

      <div class="content">
        <h3>{{ title }}</h3>

        <ul class="dots" v-show="dots">
          <li v-for="color in dots" :key="color" class="dot" :style="{ backgroundColor: `#${color}` }"></li>
        </ul>

        <p class="note">{{ note }}</p>

        <p>{{ content }}</p>
      </div>

      <div class="actions">
        <button class="raw-btn"><img src="../assets/svg/edit.svg" alt="edit" /></button>
        <button class="raw-btn"><img src="../assets/svg/drop.svg" alt="drop" /></button>
        <button class="raw-btn drag">
          <img v-if="false" src="../assets/svg/expand-active.svg" alt="expand" />
          <img v-else src="../assets/svg/expand.svg" alt="expand" />
        </button>
      </div>
    </div>
    <slot />
  </div>
</template>

<style lang="scss">
.collapse-item {
  height: 3rem;
  padding: 1rem;
  position: relative;
  @include flex($justify: "flex-start");
  border: 1px solid $second-gray;

  button {
    &.collapse {
      margin-right: 1em;
      width: 30px;
      height: 30px;
      border: 1px solid $second-gray !important;
      border-radius: 50%;
      @include flex();

      img {
        position: absolute;
      }
    }

    &.down {
      img {
        transform: rotate(180deg);
      }
    }
  }

  div {
    &.content {
      flex-grow: 1;
      @include flex($justify: "flex-start");

      h3 {
        font-size: x-larger;
        font-weight: 3000;
        margin-right: 1em;
      }

      p {
        color: $first-gray;
        margin-right: 1em;
      }

      .dots {
        margin-right: 1em;
        @include flex();
        .dot {
          border-radius: 50%;
          width: 11px;
          height: 11px;
          margin: 0 3px;
          // background-color: green;
        }
      }
    }
  }

  .actions {
    @include flex($gap: 1em);
    button {
      margin-right: 2em;

      &.drag {
        cursor: move; // fallback
        cursor: grab !important;

        &:active {
          opacity: 1;
          cursor: grabbing;
        }
      }
    }
  }
}
</style>
