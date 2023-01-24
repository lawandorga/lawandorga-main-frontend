<template>
  <BoxHeadingStats
    class="max-w-2xl"
    :title="folder.folder.name"
    :show="selectedType === 'FOLDER' && selectedId === null"
    :stats="[`Folder`]"
  >
    <template #buttons>
      <FoldersChangeName
        :folder-name="folder.folder.name"
        :folder-uuid="folder.folder.uuid"
        :query="query"
      />
    </template>
    <div class="prose">
      <h3>Everything is inside folders now</h3>
      <p>
        You probably just opened a record, but now this record is inside a
        folder. And Law&Orga didn't open the record but the folder. At first,
        this might be confusing, but it leads to many advantages.
      </p>
      <p>
        For example, you could have multiple records inside the same folder.
        Furthermore, access management is more accessible as the folders handle
        access.
      </p>
      <h4>Example workflow</h4>
      <p>
        For every new case, a folder can be created. And that folder can contain
        multiple records because it concerns multiple advice seekers. But it
        also could contain no records, as some law clinics only upload files and
        don't use the records feature. While there had to be a record in the
        past, that is not the case anymore.
      </p>
      <p>
        We hope that with this change, we can better reflect the reality of
        consultation in law clinics.
      </p>
      <h4>Feedback</h4>
      <p>
        If you have any ideas on how to improve Law&Orga or want to tell us that
        you don't like folders, please email us at
        <a href="mailto:it@law-orga.de">it@law-orga.de</a>
        and we'll try our best to improve your experience.
      </p>
      <h4>P.S.</h4>
      <p>
        In the future, we might rename records to data sheets. As that name
        reflects better what they are.
      </p>
    </div>
  </BoxHeadingStats>
</template>

<script setup lang="ts">
import BoxHeadingStats from "./BoxHeadingStats.vue";
import { IFolderDetail } from "@/types/folders";
import FoldersChangeName from "@/actions/FoldersChangeName.vue";

defineProps<{
  selectedId: string | number | null;
  selectedType: string;
  folder: IFolderDetail;
  query: () => void;
}>();
</script>
