import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

export interface Letterhead {
  uuid: string;
  address_line_1: string | undefined;
  address_line_2: string | undefined;
  address_line_3: string | undefined;
  address_line_4: string | undefined;
  address_line_5: string | undefined;
  text_right: string | undefined;
  logo_base64: string;
}

export function useLetterhead(id: string) {
  const letterhead = ref<Letterhead>();
  const query = useGet2("/api/collab/query/letterhead/" + id + "/", letterhead);

  return {
    letterhead,
    query,
  };
}
