import { AccessRequest } from "./accessRequest";
import { Deletion } from "./deletion";
import { ListRecordV2 } from "./listRecordV2";
import { View } from "./view";

export interface RecordListPageV2 {
  records: ListRecordV2[];
  columns: string[];
  views: View[];
  deletions: Deletion[];
  access_requests: AccessRequest[];
  badges: { access_requests: number; deletion_requests: number };
}
