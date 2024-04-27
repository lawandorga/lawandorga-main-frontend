<script setup lang="ts"></script>

<template>
  <div show>
    <div class="p-5 prose bg-white rounded shadow">
      <h2>Migration in process</h2>
      <p>
        Collab will be migrated into folders. That happens with the optimize
        function. You can call this optimize function here:
        <router-link :to="{ name: 'user-optimize' }">
          To the optimize function.
        </router-link>
      </p>
      <p>
        <b>Attention:</b>
        You need one of the following permissions to be able to migrate the
        collab documents: `collab__read_all_documents` or
        `collab__write_all_documents`.
      </p>
      <p>
        <b>Attiontion:</b>
        Furthermore you need to be a member of
        <b>all</b>
        groups that have access to at least one collab document.
      </p>
    </div>
  </div>
</template>
