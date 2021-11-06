<template>
  <div class="max-w-2xl mx-auto">
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="
              shadow
              overflow-hidden
              border-b border-gray-200
              sm:rounded-lg
            "
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
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
                    Questionnaire
                  </th>
                  <th
                    scope="col"
                    class="
                      relative
                      px-6
                      py-3
                      whitespace-nowrap
                      text-sm text-right
                    "
                  >
                    <a
                      routerLink="/admin/questionnaires/create"
                      class="
                        text-gray-600
                        hover:text-gray-900
                        font-medium
                        bg-transparent
                      "
                    >
                      Add Questionnaire
                    </a>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let item of questionnaires"
                  class="odd:bg-white even:bg-gray-50"
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
                    {{ item.name }}
                  </td>
                  <td
                    class="
                      px-6
                      py-4
                      whitespace-nowrap
                      text-sm
                      flex flex-row
                      space-x-2
                      justify-end
                    "
                  >
                    <a
                      [routerLink]="'/admin/questionnaires/' + item.id + '/update/'"
                      class="
                        text-gray-600
                        hover:text-gray-900
                        font-medium
                        bg-transparent
                      "
                    >
                      Edit
                    </a>
                    <button
                      type="button"
                      (click)="deleteQuestionnaire(item.id)"
                      class="
                        text-gray-600
                        hover:text-gray-900
                        font-medium
                        bg-transparent
                      "
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                <tr class="odd:bg-white even:bg-gray-50">
                  <td colspan="2" class="px-6 py-4 whitespace-nowrap text-sm">
                    <a
                      routerLink="/admin/questionnaires/create"
                      class="
                        text-gray-600
                        hover:text-gray-900
                        font-medium
                        bg-transparent
                      "
                    >
                      Add Questionnaire
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
