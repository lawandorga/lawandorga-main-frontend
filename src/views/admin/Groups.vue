<template>
  <mat-card style="padding: 0">
    <table *ngIf="groups" mat-table [dataSource]="groups" style="width: 100%">
      <ng-container mat-column-def="group">
        <th mat-header-cell *matHeaderCellDef>Group</th>
        <td mat-cell *matCellDef="let group">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-right: 24px;
            "
          >
            <a [routerLink]="groupDetailUrl(group.id)" class="underline">
              {{ group.name }}
            </a>
            <a
              [routerLink]="groupDetailUrl(group.id)"
              mat-button
              style="margin-left: auto"
            >
              Open
            </a>
          </div>
        </td>
      </ng-container>
      <ng-container mat-column-def="description">
        <th mat-header-cell *matHeaderCellDef>Description</th>
        <td mat-cell *matCellDef="let group">{{ group.description }}</td>
      </ng-container>
      <ng-container mat-column-def="action">
        <th mat-header-cell *matHeaderCellDef style="text-align: right">
          <button mat-button (click)="onAddGroup()" color="primary">
            Add Group
          </button>
        </th>
        <td mat-cell *matCellDef="let group" style="text-align: right">
          <button mat-button color="warn" (click)="onDeleteGroup(group.id)">
            Delete
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="groupsDisplayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: groupsDisplayedColumns;"></tr>
    </table>
  </mat-card>
</template>

<script>
export default {
  data() {
    return {
      fields: [
        {
          label: "Name",
          type: "text",
          tag: "input",
          name: "name",
          required: true,
        },
        {
          label: "Description",
          tag: "textarea",
          name: "description",
          required: false,
        },
      ],
    };
  },
};
</script>
