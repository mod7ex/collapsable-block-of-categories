declare global {
  interface Window {}

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
}

export {};
