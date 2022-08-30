import { shallowRef, type ShallowRef } from "vue";

let draggedEl: ShallowRef<HTMLElement | undefined> | undefined;

const clearMemo = () => {
  draggedEl = undefined;
};

const eventPayloadGen = (e: DragEvent) => {
  const el = e.target as HTMLElement;
  let _payload = {};

  return {
    index: el.dataset.index ? Number(el.dataset.index) : null,
    parent_index: el.dataset.parent_index ? Number(el.dataset.parent_index) : null,
  };
};

export default () => {
  if (!draggedEl) draggedEl = shallowRef<HTMLElement>();

  return { draggedEl, clearMemo, eventPayloadGen };
};
