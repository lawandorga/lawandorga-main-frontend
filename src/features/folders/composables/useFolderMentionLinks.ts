import { useRouter } from "vue-router";

export function useFolderMentionLinks() {
  const router = useRouter();

  const onFolderMentionClick = (event: MouseEvent) => {
    const link = (event.target as HTMLElement).closest(
      'a[data-type="folderMention"]',
    );
    if (!link) return;

    const uuid = link.getAttribute("data-id");
    if (!uuid) return;

    event.preventDefault();
    router.push({ name: "folders-detail", params: { uuid } });
  };

  return { onFolderMentionClick };
}
