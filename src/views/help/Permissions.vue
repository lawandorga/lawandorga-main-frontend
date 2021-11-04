<template>
  <h2 class="text-lg font-medium mb-4">
    <router-link :to="{ name: 'help-dashboard' }">Help</router-link>
    / Permissions
  </h2>
  <div class="flex flex-col">
    <div class="overflow-x-auto">
      <div class="align-middle inline-block min-w-full">
        <div class="shadow overflow-hidden border-b border-gray-200 rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                >
                  Permission
                </th>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                >
                  Explanation
                </th>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                >
                  Useful Group
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="permission in permissions"
                :key="permission.name"
                class="bg-white"
              >
                <td
                  class="
                    px-6
                    py-4
                    whitespace-nowrap
                    text-sm
                    font-medium
                    text-gray-900
                  "
                >
                  {{ permission.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ permission.explanation }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ permission.group }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  setup() {
    const permissions = [
      {
        name: "accept_new_users_rlc",
        explanation: "Zulassung neuer Nutzer*innen",
        group: "Administrator*innen / Vorstand",
      },
      {
        name: "access_to_files_rlc",
        explanation: "Genereller Zugriff aufs Dateimanagement (Files)",
        group: "Alle Nutzer*innen",
      },
      {
        name: "add_record_rlc",
        explanation: "Akten anlegen",
        group: "Berater*innen",
      },
      {
        name: "can_consult",
        explanation:
          "Nutzer*in kann als „Consultant“ (Berater*in) eingetragen werden",
        group: "Berater*innen",
      },
      {
        name: "manage_collab_document_permissons_rlc",
        explanation: "Verwaltung der Berechtigungen für Collab",
        group: "Administrator*innen/ Vorstand",
      },
      {
        name: "manage_folder_permissions_rlc",
        explanation: "Verwaltung der Berechtigungen im Dateimanagement",
        group: "Administrator*innen / Vorstand",
      },
      {
        name: "manage_group",
        explanation: "Verwaltung einzelner Gruppe",
        group: "Entsprechendes Ressort",
      },
      {
        name: "manage_groups_rlc",
        explanation: "Verwaltung aller Gruppen",
        group: "Administrator*innen / Vorstand",
      },
      {
        name: "manage_permissions_rlc",
        explanation: "Allgemeine Berechtigungsverwaltung",
        group: "Administrator*innen / Vorstand",
      },
      {
        name: "manage_users",
        explanation: "Verwaltung der Nutzer*innen",
        group: "Administrator*innen / Vorstand",
      },
      {
        name: "permit_record_permission_requests_rlc",
        explanation: "Bearbeitung von Aktenzugriffsanfragen",
        group: "Administrator*innen / Vorstand",
      },
      {
        name: "process_record_deletion_requests",
        explanation: "Bearbeitung von Aktenlöschanfragen",
        group: "Administrator*innen / Vorstand",
      },
      {
        name: "read_all_collab_documents_rlc",
        explanation: "Zugriff auf alle Collab Dokumente",
        group: "Aller Nutzer*innen",
      },
      {
        name: "read_all_folders_rlc",
        explanation:
          "Genereller Lesezugriff auf alle Ordner im Dateimanagement",
        group: "Administrator*innen / Vorstand",
      },
      {
        name: "view_permissions_rlc",
        explanation: "Sichtbarkeit von allgemeinen Berechtigungen",
        group: "Administrator*innen / Vorstand",
      },
      {
        name: "view_records_full_detail_rlc",
        explanation: "Vollständiger Zugriff auf alle Akten",
        group: "Administrator*innen / Vorstand",
      },
      {
        name: "view_records_rlc",
        explanation:
          "Zugriff auf Grundinformationen der Akten; Sichtbarkeit von Reiter „Records“",
        group: "Administrator*innen / Vorstand / Berater*innen",
      },
      {
        name: "write_all_collab_documents_rlc",
        explanation: "Genereller Schreibzugriff auf Collab Dokumente",
        group: "Alle Nutzer*innen",
      },
      {
        name: "write_all_folders_rlc",
        explanation: "Genereller Schreibzugriff auf Ordner im Dateimanagement",
        group: "Administrator*innen / Vorstand",
      },
    ];

    return {
      permissions,
    };
  },
});
</script>
