import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

export type TemplateType = "letterhead" | "footer";

export interface Letterhead {
  name: string;
  description: string;
  template_type: TemplateType;
  uuid: string;
}

// interface Footer {}

export type Templates = Letterhead[]; // | Footer[];

const useCollab = () => {
  const templates = ref<Templates>([]);
  const query = useGet2("/api/collab/query/templates/", templates);

  return {
    query,
    templates,
  };
};

export default useCollab;
