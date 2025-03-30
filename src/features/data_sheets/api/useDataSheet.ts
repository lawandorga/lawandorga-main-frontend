import { ref, Ref, watch } from "vue";
import useQuery from "@/composables/useQuery";
import useClient from "@/api/client";

export type SheetValue =
  | string
  | number
  | string[]
  | number[]
  | File
  | boolean
  | undefined
  | null;

export type SheetField = {
  id: number;
  uuid: string;
  kind: string;
  label: string;
  name: string;
  options?: ({ name: string; id: number } | string)[];
  type: string;
};

export interface Sheet {
  created: string;
  updated: string;
  id: number;
  uuid: string;
  folder_uuid: string;
  name: string;
  fields: SheetField[];
  entries: { [key: string]: SheetValue };
  template_name: string;
}

export function useDataSheet(
  selectedId: Ref<string | number | null>,
  selectedType: Ref<string>,
) {
  const client = useClient();
  const request = client.get("api/data_sheets/query/{}/", selectedId);
  const record = ref<Sheet | null>(null);
  const recordsQuery = useQuery(request, record);

  const update = () => {
    if (record.value && selectedId.value !== record.value.uuid)
      record.value = null;
    if (selectedType.value === "RECORD" && selectedId.value) {
      recordsQuery();
    }
  };
  watch(selectedId, () => {
    update();
  });
  update();

  return { record, recordsQuery };
}
