<script setup lang="ts">
import Draggable from "vuedraggable";
import { Colors, uidGen } from "./utils";
import { reactive, computed, shallowRef } from "vue";
import ItemVue from "./components/Item.vue";
import TheHeader from "./components/TheHeader.vue";

const searchPayload = shallowRef("Документы");

const uid = uidGen("app");

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

const reRender = shallowRef(0);

const mainRef = shallowRef<HTMLDivElement>();

const draggedEl = shallowRef<HTMLElement>();

type TPayload = Partial<{ index: number; parent_index: number }>;

const startDrag = (e: DragEvent) => {
  const el = e.target as HTMLElement;

  mainRef.value!.classList.add("drag-active");
  el.classList.add("being-dragged");
  draggedEl.value = el;

  e.dataTransfer!.dropEffect = "move";
  e.dataTransfer!.effectAllowed = "move";

  e.dataTransfer!.setData(
    "payload",
    JSON.stringify({
      index: Number(el.dataset.index),
      parent_index: Number(el.dataset.parent_index),
    })
  );
};

const onDrop = (e: DragEvent) => {
  const el = e.target as HTMLElement;

  const target_payload = {
    index: el.dataset.index ? Number(el.dataset.index) : null,
    parent_index: el.dataset.parent_index ? Number(el.dataset.parent_index) : null,
  };

  const source_payload: TPayload = JSON.parse(e.dataTransfer?.getData("payload") ?? "{}");

  // ***** logic

  const is_source_child = source_payload.parent_index != null;
  const is_target_child = target_payload.parent_index != null;

  if (is_source_child === is_target_child) {
    if (is_source_child) {
      let element = data[source_payload.parent_index!].children!.splice(source_payload.index!, 1)[0];
      if (!data[target_payload.parent_index!].children) data[target_payload.parent_index!].children = [];
      data[target_payload.parent_index!].children!.splice(target_payload.index!, 0, element);
    } else {
      const a_i = source_payload.index!;
      const b_i = target_payload.index!;

      const element = data.splice(a_i, 1)[0];

      data.splice(b_i, 0, element);
    }
    reRender.value = Date.now();
  }
  // else if (is_source_child && el.classList.contains("uncategorized")) {
  //   let element = data[source_payload.parent_index!].children!.splice(source_payload.index!, 1)[0];
  //   if (!data[data.length - 1].children) data[data.length - 1].children = [];
  //   data[data.length - 1].children!.splice(0, 0, element);
  // }

  draggedEl.value?.classList.remove("being-dragged");
  mainRef.value!.classList.remove("drag-active");
};
</script>

<template>
  <div id="container">
    <the-header v-model="searchPayload" />

    <main :key="reRender" ref="mainRef">
      <div v-for="({ title, content, note, dots, id, children }, i) in categories" :key="id">
        <item-vue :index="i" @dragstart="startDrag" @drop="onDrop" v-model="data[i].collapsed" :collapsable="true" :content="content" :title="title" :note="note" :dots="dots" :id="id" />
        <Transition name="slide-fade">
          <div :class="['children', `h-${children?.length ?? 0}`]" v-if="!data[i].collapsed" @drop="onDrop" @dragenter.prevent @dragover.prevent>
            <item-vue class="child" v-for="(c, j) in children" :index="j" :parent_index="i" @dragstart="startDrag" :content="c.content" :title="c.title" :note="c.note" :dots="c.dots" :key="c.id" :id="c.id" />
          </div>
        </Transition>
      </div>

      <div class="uncategorized" @drop="onDrop">
        <item-vue class="child" v-for="(c, k) in uncategorizedItems.children" :index="k" :parent_index="data.length - 1" :key="c.id" @dragstart="startDrag" :content="c.content" :title="c.title" :dots="c.dots" :note="c.note" :id="c.id" />
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

  .being-dragged {
    opacity: 0.1;
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
    background-color: green;
    padding: 3em 0;
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
