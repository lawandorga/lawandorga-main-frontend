import useGet2 from "@/composables/useGet2";
import type { OrgUser } from "@/features/admin/api/useProfileData";
import { ref } from "vue";

interface Article {
  id: number;
  title: string;
  description: string;
  recipients: OrgUser[];
  date: Date;
}

export function useArticles() {
  const articles = ref<Article[] | null>();
  useGet2("/api/internal/articles/dashboard/", articles);

  return {
    articles,
  };
}
