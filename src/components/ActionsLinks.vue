<template>
  <ModalCreate
    v-model="createModalOpen"
    title="Create Link"
    :request="createRequest"
    :fields="fields"
  />
  <ModalDelete
    v-model="deleteModalOpen"
    :request="deleteRequest"
    :data="temporary"
    title="Delete Link"
  />
</template>

<script setup lang="ts">
import { ModalCreate, ModalDelete, types } from "@lawandorga/components";
import { ref } from "vue";
import { Link } from "@/types/org";
import useGet from "@/composables/useGet";
import OrgService from "@/services/org";
import useDelete from "@/composables/useDelete";
import useCreate from "@/composables/useCreate";

// get
const links = ref<Link[]>([]);
useGet(OrgService.getLinks, links);

// create
const fields: types.FormField[] = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Link",
    name: "link",
    type: "text",
    required: true,
    helptext: "The link needs to start with 'https://'",
  },
  {
    label: "Order",
    name: "order",
    type: "number",
    required: true,
  },
];
const { createRequest, createModalOpen } = useCreate(
  OrgService.createLink,
  links,
);

// delete
const { deleteRequest, deleteModalOpen, temporary } = useDelete(
  OrgService.deleteLink,
  links,
);

// expose
defineExpose({ links, createModalOpen, deleteModalOpen, temporary });
</script>
