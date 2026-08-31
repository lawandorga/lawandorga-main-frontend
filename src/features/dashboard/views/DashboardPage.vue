<script lang="ts" setup>
import { useUserStore } from "@/store/user";

import ArticleList from "../components/ArticleList.vue";
import ChangedRecordsList from "../components/ChangedRecordsList.vue";
import FollowUpList from "../components/FollowUpList.vue";
import MembersList from "../components/MembersList.vue";
import NotesList from "../components/NotesList.vue";
import QuestionnaireList from "../components/QuestionnaireList.vue";
import RecordsList from "../components/RecordsList.vue";
import SurveyPill from "../components/SurveyPill.vue";
import TaskList from "../components/TaskList.vue";

const userStore = useUserStore();
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <h1 class="sr-only">Dashboard</h1>
    <SurveyPill />
    <NotesList />
    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
      <RecordsList />
      <QuestionnaireList />
      <FollowUpList />
    </div>
    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
      <ChangedRecordsList />
      <MembersList v-if="userStore.hasPermission('admin__manage_users')" />
    </div>
    <ArticleList />
    <TaskList />
  </div>
</template>
