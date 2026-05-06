<script lang="ts" setup>
import TaskList from "../components/TaskList.vue";
import NotesList from "../components/NotesList.vue";
import SurveyPill from "../components/SurveyPill.vue";
import ArticleList from "../components/ArticleList.vue";
import QuestionnaireList from "../components/QuestionnaireList.vue";
import MembersList from "../components/MembersList.vue";
import FollowUpList from "../components/FollowUpList.vue";
import RecordsList from "../components/RecordsList.vue";
import ChangedRecordsList from "../components/ChangedRecordsList.vue";
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <SurveyPill />
    <NotesList />
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <RecordsList />
      <QuestionnaireList />
      <FollowUpList />
    </div>
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ChangedRecordsList />
      <MembersList />
    </div>
    <ArticleList />
    <TaskList />
  </div>
</template>
