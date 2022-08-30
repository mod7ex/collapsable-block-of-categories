<script setup lang="ts">
import Draggable from "vuedraggable";
import { reactive, ref, computed } from "vue";
import { Colors, uidGen } from "./utils";
import ItemVue from "./components/Item.vue";
import TheHeader from "./components/TheHeader.vue";

const searchPayload = ref("Документы");

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

const reRender = ref(0);

const mainRef = ref<HTMLDivElement>();

const categories = computed(() => data.filter(({ uncategorized }) => !uncategorized));
const uncategorizedItems = computed(() => data.filter(({ uncategorized }) => !!uncategorized)[0]);

type TPayload = Partial<{ index: number; parent_index: number; is_child: boolean }>;

const startDrag = (e: DragEvent, payload: TPayload) => {
  mainRef.value!.classList.add("drag-active");

  (e.target as HTMLElement).classList.add("being-dragged");

  const { index, parent_index } = payload;

  e.dataTransfer!.dropEffect = "move";
  e.dataTransfer!.effectAllowed = "move";

  e.dataTransfer!.setData("payload", JSON.stringify({ ...payload, is_child: parent_index !== undefined }));
};

const onDrop = (e: DragEvent, payload: TPayload) => {
  const target_payload = { ...payload, is_child: payload.parent_index !== undefined };

  const source_payload: TPayload = JSON.parse(e.dataTransfer?.getData("payload") ?? "{}");

  // ***** logic

  if (source_payload.is_child === target_payload.is_child) {
    if (source_payload.is_child) {
      let element = data[Number(source_payload.parent_index!)].children!.splice(Number(source_payload.index!), 1)[0];
      if (!data[Number(target_payload.parent_index!)].children) data[Number(target_payload.parent_index!)].children = [];
      data[Number(target_payload.parent_index!)].children!.splice(Number(target_payload.index!), 0, element);
    } else {
      const a_i = Number(source_payload.index!);
      const b_i = Number(target_payload.index!);

      const element = data.splice(a_i, 1)[0];

      data.splice(b_i, 0, element);
    }
    reRender.value = Date.now();
  }

  mainRef.value!.classList.remove("drag-active");
};

const onOver = (e: DragEvent, payload: TPayload) => {
  console.log(payload, e.target);
};
</script>

<template>
  <div id="container">
    <the-header v-model="searchPayload" />

    <main :key="reRender" ref="mainRef">
      <div v-for="({ title, content, note, dots, id, children }, i) in categories" :key="id">
        <item-vue class="parent" @dragover="(e) => onOver(e, { index: i })" @dragstart="(e) => startDrag(e, { index: i })" @drop="(e) => onDrop(e, { index: i })" v-model="data[i].collapsed" :collapsable="true" :content="content" :title="title" :note="note" :dots="dots" :id="id" />
        <Transition name="slide-fade">
          <div :class="['children', `h-${children?.length ?? 0}`]" v-if="data[i].collapsed" @drop="(e) => onDrop(e, { index: 0, parent_index: i })" @dragenter.prevent @dragover.prevent>
            <item-vue class="child" v-for="(c, j) in children" @dragstart="(e) => startDrag(e, { index: j, parent_index: i })" @drop="(e) => onDrop(e, { index: j, parent_index: i })" :content="c.content" :title="c.title" :note="c.note" :dots="c.dots" :key="c.id" :id="c.id" />
          </div>
        </Transition>
      </div>

      <div class="uncategorized">
        <item-vue class="child" v-for="(c, k) in uncategorizedItems.children" :key="c.id" @drop="(e) => onDrop(e, { index: k, parent_index: 3 })" @dragstart="(e) => startDrag(e, { index: k, parent_index: 3 })" :content="c.content" :title="c.title" :dots="c.dots" :note="c.note" :id="c.id" />
      </div>
    </main>
  </div>
</template>

<style lang="scss">
.drag-active {
  .collapse-item {
    &.border-b {
      border-bottom: 6px solid $first-blue;
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
