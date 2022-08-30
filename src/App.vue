<script setup lang="ts">
import Draggable from "vuedraggable";
import { Colors, uidGen } from "./utils";
import { reactive, computed, shallowRef } from "vue";
import ItemVue from "./components/Item.vue";
import TheHeader from "./components/TheHeader.vue";

const uid = uidGen("app");

const searchPayload = shallowRef("Документы");

interface IStructure {
  uncategorized: boolean;
  collapsed: boolean;
  id: string;
  title: string;
  note?: string;
  content: string;
  dots: Colors[];
  children: Partial<IStructure>[];
}

const data = reactive<Partial<IStructure>[]>([
  {
    id: uid(),
    collapsed: false,
    title: "Обязательные для всех",
    content: "Документы, обязательные для всех сотрудников без исключения",
    dots: [Colors.PINK, Colors.YELLOW, Colors.ORANGE],
    children: [
      {
        id: uid(),
        title: "Паспорт",
        note: "Обязательный",
        content: "Для всех",
        dots: [Colors.SKY],
      },
      {
        id: uid(),
        title: "ИНН",
        note: "Обязательный",
        content: "Для всех",
      },
    ],
  },

  {
    id: uid(),
    collapsed: false,
    title: "Обязательные для трудоустройства",
    content: "Документы, без которых невозможно трудоустройство человека на какую бы то ни было должность в компании вне зависимости от граж",
    children: [],
  },

  {
    id: uid(),
    collapsed: false,
    title: "Специальные",
    children: [],
  },

  {
    id: uid(),
    uncategorized: true,
    children: [
      {
        id: uid(),
        title: "Тестовое задание кандидата",
        content: "Россия, Белоруссия, Украина, администратор филиала, повар-сушист, повар-пиццмейкер, повар горячего цеха",
      },
      {
        id: uid(),
        title: "Трудовой договор",
        dots: [Colors.BLUE, Colors.GRAY],
      },
      {
        id: uid(),
        title: "Мед. книжка",
      },
    ],
  },
]);

const categories = computed(() => data.filter(({ uncategorized }) => !uncategorized));
const uncategorizedItems = computed(() => data.filter(({ uncategorized }) => !!uncategorized)[0]);
</script>

<template>
  <div id="container">
    <the-header v-model="searchPayload" />

    <main>
      <div v-for="({ title, content, note, dots, id, children }, i) in categories" :key="id">
        <item-vue :index="i" v-model="data[i].collapsed" :collapsable="true" :content="content" :title="title" :note="note" :dots="dots" :id="id" />
        <Transition name="slide-fade">
          <div :class="['children', `h-${!!children?.length ? children?.length : 1}`]" v-if="!data[i].collapsed" @dragenter.prevent @dragover.prevent>
            <item-vue class="child" v-for="(c, j) in children" :index="j" :parent_index="i" :content="c.content" :title="c.title" :note="c.note" :dots="c.dots" :key="c.id" :id="c.id" />
            <item-vue :collapsable="true" v-if="!children?.length" class="child" :index="0" :parent_index="i" :id="uid()" />
          </div>
        </Transition>
      </div>

      <div class="uncategorized">
        <item-vue class="child" v-for="(c, k) in uncategorizedItems.children" :index="k" :parent_index="data.length - 1" :key="c.id" :content="c.content" :title="c.title" :dots="c.dots" :note="c.note" :id="c.id" />
        <item-vue :collapsable="true" v-if="!uncategorizedItems.children?.length" class="child" :index="0" :parent_index="data.length - 1" :id="uid()" />
      </div>
    </main>
  </div>
</template>

<style lang="scss">
.drag-active {
  .collapse-item {
    .overlay {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;

      &.border-b {
        border-top: 6px solid $first-blue;
      }
    }

    &.being-dragged {
      opacity: 0.1;

      & + .children {
        opacity: 0.1;
      }

      .actions {
        button.drag {
          img {
            &.drag-show {
              display: inline;
            }
            &.drag-hide {
              display: none;
            }
          }
        }
      }
    }
  }
}

#container {
  max-width: $main-width;
  margin: 0 auto;
  .children {
    padding-left: 3em;
    overflow: hidden;
  }
  .uncategorized {
    padding: 0;
    margin-top: 1.5em;
  }
}
// *************************Transition
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
