import { IContent, IFolderItem } from "@/types/folders";
import { computed, Ref } from "vue";

export function useFolderProperties(
  folders: Ref<(IFolderItem | IContent)[] | null>,
) {
  const getFolderProperties = (item: IFolderItem): string => {
    const properties: string[] = [];
    if (!item.folder.has_access) {
      properties.push("N");
      return properties.join(", ");
    }
    if (item.folder.stop_inherit) properties.push("C");
    if (item.content.some((i: IContent) => i.repository === "RECORDS_RECORD"))
      properties.push("R");
    return properties.join(", ");
  };

  const properties = computed<{ [key: string]: string }>(() => {
    const ret: { [key: string]: string } = {};
    folders.value
      ?.filter((i) => "folder" in i)
      .forEach((i) => {
        if ("folder" in i) ret[i.folder.uuid] = getFolderProperties(i);
      });
    return ret;
  });

  return {
    properties,
  };
}
