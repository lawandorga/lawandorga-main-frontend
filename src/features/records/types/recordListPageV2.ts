import { IListRecordV2 } from "./listRecordV2";
import { IView } from "./view";

export interface IRecordListPageV2 {
  records: IListRecordV2[];
  columns: string[];
  views: IView[];
}
