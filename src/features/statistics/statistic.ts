import {
  RecordClientValueCount,
  RecordState,
  RecordTagStats,
  UserAction,
  TagCount,
} from "@/features/statistics/types";
import axios from "axios";

class StatisticService {
  getUserActionsMonth() {
    return axios
      .get<UserAction[]>("statistics/individual/user_actions_month/")
      .then((response) => response.data);
  }

  getRecordStates() {
    return axios
      .get<RecordState[]>("statistics/individual/record_states/")
      .then((response) => response.data);
  }

  getRecordClientSex() {
    return axios
      .get<RecordClientValueCount[]>("statistics/individual/record_client_sex/")
      .then((response) => response.data);
  }

  getRecordClientNationality() {
    return axios
      .get<
        RecordClientValueCount[]
      >("statistics/individual/record_client_nationality/")
      .then((response) => response.data);
  }

  getRecordClientState() {
    return axios
      .get<
        RecordClientValueCount[]
      >("statistics/individual/record_client_state/")
      .then((response) => response.data);
  }

  getRecordClientAge() {
    return axios
      .get<RecordClientValueCount[]>("statistics/individual/record_client_age/")
      .then((response) => response.data);
  }

  getRecordsTagData(): Promise<TagCount[]> {
    return axios
      .get<RecordTagStats>("statistics/individual/tag_stats/")
      .then((response) => {
        const ret = response.data["tags"];
        ret.push({
          tag: "Unknown",
          count:
            response.data["state"].length == 2
              ? response.data["state"][1]["count"]
              : 0,
        });
        return ret;
      });
  }
}

export default new StatisticService();
