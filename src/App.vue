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
    collapsed: true,
    title: "Обязательные для всех",
    content: "Документы, обязательные для всех сотрудников без исключения",
    dots: [Colors.PINK, Colors.YELLOW, Colors.ORANGE],
    children: [
      {
        id: uid(),
        collapsed: true,
        title: "Паспорт",
        note: "Обязательный",
        content: "Для всех",
        dots: [Colors.SKY],
      },
      {
        id: uid(),
        collapsed: true,
        title: "ИНН",
        note: "Обязательный",
        content: "Для всех",
      },
    ],
  },

  {
    id: uid(),
    collapsed: true,
    title: "Обязательные для трудоустройства",
    content: "Документы, без которых невозможно трудоустройство человека на какую бы то ни было должность в компании вне зависимости от граж",
    children: [],
  },

  {
    id: uid(),
    collapsed: true,
    title: "Специальные",
    children: [],
  },

  {
    id: uid(),
    uncategorized: true,
    children: [
      {
        id: uid(),
        collapsed: true,
        title: "Тестовое задание кандидата",
        content: "Россия, Белоруссия, Украина, администратор филиала, повар-сушист, повар-пиццмейкер, повар горячего цеха",
      },
      {
        id: uid(),
        collapsed: true,
        title: "Трудовой договор",
        dots: [Colors.BLUE, Colors.GRAY],
      },
      {
        id: uid(),
        collapsed: true,
        title: "Мед. книжка",
      },
    ],
  },
]);

const reRender = ref(0);

const categories = computed(() => data.filter(({ uncategorized }) => !uncategorized));
const uncategorizedItems = computed(() => data.filter(({ uncategorized }) => !!uncategorized)[0]);

type TPayload = Partial<{ index: number; parent_index: number; is_child: boolean }>;

const startDrag = (e: DragEvent, payload: TPayload) => {
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

      console.log(b_i, a_i);
    }
    reRender.value = Date.now();
  }
};
</script>

<template>
  <div id="container">
    <the-header v-model="searchPayload" />

    <main :key="reRender">
      <div v-for="({ title, content, note, dots, id, children }, i) in categories" :key="id">
        <item-vue @dragstart="(e) => startDrag(e, { index: i })" @drop="(e) => onDrop(e, { index: i })" v-model="data[i].collapsed" :collapsable="true" :title="title" :content="content" :note="note" :dots="dots" :id="id" />
        <Transition name="slide-fade">
          <div :class="['children', `h-${children?.length ?? 0}`]" v-if="data[i].collapsed" @drop="(e) => onDrop(e, { index: 0, parent_index: i })" @dragenter.prevent @dragover.prevent>
            <item-vue v-for="(c, j) in children" @dragstart="(e) => startDrag(e, { index: j, parent_index: i })" @drop="(e) => onDrop(e, { index: j, parent_index: i })" :key="c.id" :title="c.title" :content="c.content" :note="c.note" :dots="c.dots" :id="c.id" />
          </div>
        </Transition>
      </div>

      <div class="uncategorized">
        <item-vue v-for="(c, k) in uncategorizedItems.children" :key="c.id" @drop="(e) => onDrop(e, { index: k, parent_index: 3 })" @dragstart="(e) => startDrag(e, { index: k, parent_index: 3 })" :title="c.title" :content="c.content" :note="c.note" :dots="c.dots" :id="c.id" />
      </div>
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
    padding-top: 0.5em;
    padding-bottom: 0.5em;
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
