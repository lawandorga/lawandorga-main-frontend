import { ref } from "vue";

export default function useMenuOpen() {
  const menuOpen = ref(true);
  const setMenuOpen = (open: boolean) => (menuOpen.value = open);

  return {
    menuOpen,
    setMenuOpen,
  };
}
