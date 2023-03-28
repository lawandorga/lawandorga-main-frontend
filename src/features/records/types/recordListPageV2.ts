import { IAccessRequest } from "./accessRequest";
import { IDeletion } from "./deletion";
import { IListRecordV2 } from "./listRecordV2";
import { IView } from "./view";

export interface IRecordListPageV2 {
  records: IListRecordV2[];
  columns: string[];
  views: IView[];
  deletions: IDeletion[];
  access_requests: IAccessRequest[];
  badges: { access_requests: number; deletion_requests: number };
}
