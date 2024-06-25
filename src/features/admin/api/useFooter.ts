import { ref } from "vue";

interface Footer {
  name: string;
  description: string;
  column1: string | undefined;
}

export function useFooter(id: string) {
  const footer = ref<Footer>();

  // todo: fetch footer data
  footer.value = {
    name: "Footer",
    description: "This is a footer",
    column1: id,
  };

  const query = () => ({});

  return {
    footer,
    query,
  };
}
