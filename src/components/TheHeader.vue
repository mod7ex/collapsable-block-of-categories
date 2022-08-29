<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(defineProps<{ modelValue?: string }>(), {
  modelValue: "",
});

const emit = defineEmits(["update:modelValue"]);

const handelSearch = (e: Event) => {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};

const isInputFocused = ref(false);
</script>

<template>
  <header>
    <div class="header-actions">
      <h1>Документы</h1>
      <ul>
        <li>
          <button class="raw-btn save">
            <img src="../assets/svg/save.svg" alt="save" />
          </button>
        </li>
        <li>
          <button class="raw-btn add">
            <img src="../assets/svg/plus.svg" alt="add" />
            <span>Новый тип</span>
          </button>
        </li>
        <li>
          <button class="raw-btn add">
            <img src="../assets/svg/plus.svg" alt="add" />
            <span>Новый документ</span>
          </button>
        </li>
      </ul>
    </div>

    <div>
      <span :class="['search', isInputFocused ? 'focused' : '']">
        <img src="../assets/svg/search.svg" alt="search icon" />
        <input type="text" placeholder="Поиск" :value="modelValue" @focus="isInputFocused = true" @blur="isInputFocused = false" @input="handelSearch" />
        <img src="../assets/svg/search-clear.svg" alt="search clear" v-if="modelValue" @click="() => $emit('update:modelValue', '')" />
      </span>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  padding: 1em 0;
  margin-bottom: 2em;

  span.search {
    @include flex();
    border-bottom: 3px solid $first-gray;
    max-width: 600px;
    width: 100%;

    &.focused {
      border-color: $first-blue;
    }

    img {
      cursor: pointer;
    }

    input[type="text"] {
      outline: none;
      border: none;
      flex-grow: 1;
      padding: 0.7em;
    }
  }

  .header-actions {
    margin-bottom: 2em;
    @include flex();
    justify-content: space-between;

    ul {
      @include flex();
      justify-content: space-between;

      li {
        button {
          margin-left: 1em;
          @include flex();
          border: 3px solid $third-gray;
          padding: 0.5em;

          p {
            font-weight: bold;
            color: black;
          }

          &.save {
            border-radius: 50%;
          }

          &.add {
            border-radius: 3em;
            padding: 0.5em 1em;
            img {
              margin-right: 1em;
            }
          }
        }
      }
    }
  }
}
</style>
