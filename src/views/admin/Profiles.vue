<template>
  <mat-card style="padding: 0">
    <table mat-table [dataSource]="users" style="width: 100%">
      <ng-container mat-column-def="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let user">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-right: 24px;
            "
          >
            <a class="underline" [routerLink]="getUserDetailUrl(user.id)">
              {{ user.name }}
            </a>
            <a
              [routerLink]="getUserDetailUrl(user.id)"
              mat-button
              style="margin-left: auto"
            >
              Open
            </a>
          </div>
        </td>
      </ng-container>
      <ng-container mat-column-def="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let user">{{ user.email }}</td>
      </ng-container>
      <ng-container mat-column-def="phone_number">
        <th mat-header-cell *matHeaderCellDef>Phone Number</th>
        <td mat-cell *matCellDef="let user">{{ user.phone_number }}</td>
      </ng-container>
      <ng-container mat-column-def="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let user" style="text-align: right">
          <button
            *ngIf="!user.accepted"
            mat-button
            (click)="onAcceptClick(user.id)"
            color="primary"
          >
            Accept
          </button>
          <button
            *ngIf="user.locked"
            mat-button
            (click)="onUnlockClick(user.id)"
            color="primary"
          >
            Unlock
          </button>
          <button mat-button (click)="onDeActiveClick(user)" color="primary">
            {{ user.is_active ? "Deactivate" : "Activate" }}
          </button>

          <button mat-button (click)="onDeleteClick(user.id)" color="warn">
            Delete
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  </mat-card>
</template>

<script>
export default {};
</script>

<style></style>
