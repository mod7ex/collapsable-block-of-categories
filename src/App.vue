<script setup lang="ts">
import Draggable from "vuedraggable";
import { reactive, ref } from "vue";
import { Colors, uidGen } from "./utils";
import ItemVue from "./components/Item.vue";
import TheHeader from "./components/TheHeader.vue";

const searchPayload = ref("Документы");

const uid = uidGen("app");

interface IStructure {
  uncategorized: boolean;
  collapsed: boolean;
  id: string | number;
  title: string;
  note?: string;
  content: string;
  dots: Colors[];
  children: Partial<IStructure>[];
}

const data = reactive<Partial<IStructure>[]>([
  {
    id: uid(),
    collapsed: true,
    title: "Обязательные для всех",
    note: "Обязательный",
    content: "Документы, обязательные для всех сотрудников без исключения",
    dots: [Colors.ORANGE, Colors.PINK, Colors.YELLOW],
    children: [
      {
        id: uid(),
        collapsed: true,
        title: "Обязательные для всех",
        note: "Обязательный",
        content: "Документы, обязательные для всех сотрудников без исключения",
        dots: [Colors.ORANGE, Colors.PINK, Colors.YELLOW],
      },
      {
        id: uid(),
        collapsed: true,
        title: "Обязательные для всех",
        note: "Обязательный",
        content: "Документы, обязательные для всех сотрудников без исключения",
        dots: [Colors.ORANGE, Colors.PINK, Colors.YELLOW],
      },
    ],
  },

  {
    id: uid(),
    collapsed: true,
    title: "Обязательные для всех",
    note: "Обязательный",
    content: "Документы, обязательные для всех сотрудников без исключения",
    dots: [Colors.ORANGE, Colors.PINK, Colors.YELLOW],
    children: [
      {
        id: uid(),
        collapsed: true,
        title: "Обязательные для всех",
        note: "Обязательный",
        content: "Документы, обязательные для всех сотрудников без исключения",
        dots: [Colors.ORANGE, Colors.PINK, Colors.YELLOW],
      },
      {
        id: uid(),
        collapsed: true,
        title: "Обязательные для всех",
        note: "Обязательный",
        content: "Документы, обязательные для всех сотрудников без исключения",
        dots: [Colors.ORANGE, Colors.PINK, Colors.YELLOW],
      },
    ],
  },

  {
    id: uid(),
    collapsed: true,
    title: "Обязательные для всех",
    content: "Документы, обязательные для всех сотрудников без исключения",
    dots: [Colors.ORANGE, Colors.PINK, Colors.YELLOW],
    children: [
      {
        id: uid(),
        collapsed: true,
        title: "Обязательные для всех",
        note: "Обязательный",
        content: "Документы, обязательные для всех сотрудников без исключения",
        dots: [Colors.ORANGE, Colors.PINK, Colors.YELLOW],
      },
    ],
  },

  {
    id: uid(),
    uncategorized: true,
    children: [
      {
        id: uid(),
        collapsed: true,
        title: "Обязательные для всех",
        note: "Обязательный",
        content: "Документы, обязательные для всех сотрудников без исключения",
        dots: [Colors.ORANGE, Colors.PINK, Colors.YELLOW],
      },
    ],
  },
]);

const reRender = ref(0);

const log = async (e: any) => {
  const { oldIndex, newIndex } = e;
  console.log({ oldIndex, newIndex });

  let a = data[oldIndex];
  let b = data[newIndex];

  data[newIndex] = a;
  data[oldIndex] = b;

  reRender.value = Date.now();
};
</script>

<template>
  <div id="container">
    <the-header v-model="searchPayload" />

    <main :key="reRender">
      <Draggable item-key="id" v-model="data" group="parent" ghost-class="ghost" class="parent" @end="log">
        <template #item="{ element, index }">
          <item-vue v-model="data[index].collapsed" :collapsable="true" :uncategorized="element.uncategorized" :title="element.title" :content="element.content" :class="[`${index}`]" :note="element.note" :id="element.id" :dots="element.dots">
            <Transition name="slide-fade">
              <Draggable v-if="!element.collapsed" item-key="id" v-model="data[index].children" group="children" ghost-class="ghost" :class="['children', `h-${data[index].children?.length ?? 0}`, element.uncategorized ? 'uncategorized' : '']">
                <template #item="{ element }">
                  <item-vue :title="element.title" :content="element.content" :note="element.note" :dots="element.dots" :id="element.id" />
                </template>
              </Draggable>
            </Transition>
          </item-vue>
        </template>
      </Draggable>
    </main>
  </div>
</template>

<style lang="scss">
#container {
  max-width: $main-width;
  margin: 0 auto;

  .children {
    padding-left: 3em;
    overflow: hidden;

    &.ghost {
      border-bottom: 3px solid $first-blue;
    }
  }

  .uncategorized {
    padding: 0;
    margin-top: 1.5em;
  }
}

.ghost {
  border-bottom: 3px solid $first-blue;
  box-shadow: 0 0 7px 3px $first-gray;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  height: 0;
}

.slide-fade-enter-to {
  @include items;
}

.slide-fade-leave-from {
  @include items;
}
</style>
