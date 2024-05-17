import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

export type TemplateType = "letterhead" | "footer";

export interface Letterhead {
  name: string;
  description: string;
  type: TemplateType;
  uuid: string;
}

// interface Footer {}

export type Templates = Letterhead[]; // | Footer[];

const useCollab = () => {
  const templates = ref<Templates>([]);
  const query = useGet2("/api/collab/query/templates/", templates);

  // const templates = computed<Letterhead[]>(() => {
  //   // TODO: get real ones
  //   return [
  //     {
  //       description:
  //         "For outgoing communication to other RLCs and other people",
  //       title: "Letterhead RLC",
  //       type: "letterhead",
  //       uuid: "abc",
  //     },
  //     {
  //       description: "The usual",
  //       title: "Default template",
  //       type: "footer",
  //       uuid: "def",
  //     },
  //     {
  //       description:
  //         "This letterhead has a very long description, it is long enough that we can't show it all in the description box",
  //       title: "Another Letterhead",
  //       type: "letterhead",
  //       uuid: "ghi",
  //     },
  //   ];
  // });

  // TODO: create one
  // this goes into actions

  // TODO: delete one
  // this goes into actions

  // TODO: edit one
  // this goes into actions

  return {
    query,
    templates,
  };
};

export default useCollab;
