<template>
  <div class="notification-list__container">
    <table
      mat-table
      [dataSource]="notificationGroup.notifications"
      class="notification-list__table"
    >
      <ng-container
        [matColumnDef]="columns[0]"
        class="notification-list__column__read"
      >
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let notification">
          <div *ngIf="notification.read; else noNotification">
            <mat-icon
              (click)="onReadClick(notification)"
              class="notification-lost__read-status"
            >
              notifications_none
            </mat-icon>
          </div>
          <ng-template #noNotification>
            <mat-icon
              (click)="onReadClick(notification)"
              class="notification-list__unread notification-lost__read-status"
            >
              notifications_active
            </mat-icon>
          </ng-template>
        </td>
      </ng-container>

      <ng-container
        mat-column-def="created1"
        class="notification-list__column__created"
      >
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let notification">
          {{ notification.created | date: 'HH:mm dd.MM.yy' }}
        </td>
      </ng-container>

      <ng-container
        mat-column-def="text1"
        class="notification-list__column__desc"
      >
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let notification" class="">
          {{ notification.description_text }}
        </td>
      </ng-container>

      <!--        <tr mat-header-row *matHeaderRowDef="columns"></tr>-->
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
    </table>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
