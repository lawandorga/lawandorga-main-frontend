import useGet2 from "@/composables/useGet2";
import type { OrgUser } from "@/features/admin/api/useProfileData";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

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

  const { user } = storeToRefs(useUserStore());

  const filteredArticles = computed(() => {
    if (!articles.value || !user.value) return null;
    return articles.value.filter((article) =>
      article.recipients.some((recipient) => recipient.id === user.value!.id),
    );
  });

  return {
    articles: filteredArticles,
  };
}
