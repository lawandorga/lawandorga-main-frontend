<template>
  <div style="display: flex; width: 100%">
    <mat-card style="width: 100%">
      <mat-card-title>Record Deletion Requests</mat-card-title>
      <table mat-table [dataSource]="deletionRequests" style="width: 100%">
        <ng-container mat-column-def="requestor">
          <th mat-header-cell *matHeaderCellDef>Requestor</th>
          <td mat-cell *matCellDef="let request">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-right: 24px;
              "
            >
              {{ request.request_from ? request.request_from.name : "-" }}
            </div>
          </td>
        </ng-container>
        <ng-container mat-column-def="record">
          <th mat-header-cell *matHeaderCellDef>Record</th>
          <td mat-cell *matCellDef="let request">
            {{ request.record ? request.record.record_token : "DELETED" }}
          </td>
        </ng-container>
        <ng-container mat-column-def="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let request">
            {{ request.requested|date:'dd.MM.yyyy HH:mm' }}
          </td>
        </ng-container>
        <ng-container mat-column-def="state">
          <th mat-header-cell *matHeaderCellDef>State</th>
          <td
            mat-cell
            *matCellDef="let request"
            [style.color]="getRequestStateColor(request.state)"
          >
            {{ getRequestState(request.state) }}
          </td>
        </ng-container>
        <ng-container mat-column-def="processor">
          <th mat-header-cell *matHeaderCellDef>Processor</th>
          <td mat-cell *matCellDef="let request">
            {{
              request.request_processed ? request.request_processed.name : "-"
            }}
          </td>
        </ng-container>
        <ng-container mat-column-def="processDate">
          <th mat-header-cell *matHeaderCellDef>Process Date</th>
          <td mat-cell *matCellDef="let request">
            {{ request.processed_on|date:'dd.MM.yyyy HH:mm' }}
          </td>
        </ng-container>
        <ng-container mat-column-def="action">
          <th mat-header-cell *matHeaderCellDef style="text-align: right"></th>
          <td mat-cell *matCellDef="let request" style="text-align: right">
            <div *ngIf="request.state === 're'">
              <button
                mat-button
                color="primary"
                (click)="onDeletionRequestAction(request.id, 'accept')"
              >
                Accept
              </button>
              <button
                mat-button
                color="warn"
                (click)="onDeletionRequestAction(request.id, 'decline')"
              >
                Decline
              </button>
            </div>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="requestsDisplayedColumns"></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: requestsDisplayedColumns;"
        ></tr>
      </table>
    </mat-card>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
