import {
  //   ErrorMonth,
  //   ErrorUser,
  //   LcUsage,
  //   RawNumbers,
  RecordClientValueCount,
  RecordState,
  RecordTagStats,
  //   RlcMember,
  UserAction,
  //   UserLogin,
  //   UserLoginMonth,
  TagCount,
  RecordsCreatedClosed,
} from "@/types/statistic";
import axios from "axios";

class StatisticService {
  getUserActionsMonth() {
    return axios
      .get<UserAction[]>("statistics/rlc/user_actions_month/")
      .then((response) => response.data);
  }

  //   getRlcMembers() {
  //     return axios
  //       .get<RlcMember[]>("statistics/rlc/rlc_members/")
  //       .then((response) => response.data);
  //   }

  getRecordStates() {
    return axios
      .get<RecordState[]>("statistics/rlc/record_states/")
      .then((response) => response.data);
  }

  //   getLcUsage() {
  //     return axios
  //       .get<LcUsage[]>("statistics/rlc/lc_usage/")
  //       .then((response) => response.data);
  //   }

  //   getUserLogins() {
  //     return axios
  //       .get<UserLogin[]>("statistics/rlc/user_logins/")
  //       .then((response) => response.data);
  //   }

  //   getUserLoginsMonth() {
  //     return axios
  //       .get<UserLoginMonth[]>("statistics/rlc/user_logins_month/")
  //       .then((response) => response.data);
  //   }

  //   getUniqueUsersMonth() {
  //     return axios
  //       .get<UserLoginMonth[]>("statistics/rlc/unique_users_month/")
  //       .then((response) => response.data);
  //   }

  //   getErrors() {
  //     return axios
  //       .get<ErrorMonth[]>("statistics/rlc/errors_month/")
  //       .then((response) => response.data);
  //   }

  //   getUserErrors() {
  //     return axios
  //       .get<ErrorUser[]>("statistics/rlc/errors_user/")
  //       .then((response) => response.data);
  //   }

  //   getRawNumbers() {
  //     return axios
  //       .get<RawNumbers>("statistics/rlc/raw_numbers/")
  //       .then((response) => response.data);
  //   }

  getRecordClientSex() {
    return axios
      .get<RecordClientValueCount[]>("statistics/rlc/record_client_sex/")
      .then((response) => response.data);
  }

  getRecordClientNationality() {
    return axios
      .get<RecordClientValueCount[]>(
        "statistics/rlc/record_client_nationality/",
      )
      .then((response) => response.data);
  }

  getRecordClientState() {
    return axios
      .get<RecordClientValueCount[]>("statistics/rlc/record_client_state/")
      .then((response) => response.data);
  }

  getRecordClientAge() {
    return axios
      .get<RecordClientValueCount[]>("statistics/rlc/record_client_age/")
      .then((response) => response.data);
  }

  getRecordsTagData(): Promise<TagCount[]> {
    return axios
      .get<RecordTagStats>("statistics/rlc/tag_stats/")
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

  getRecordsCreatedAndClosed(): Promise<RecordsCreatedClosed[]> {
    return axios
      .get<RecordsCreatedClosed[]>("statistics/org/records_created_and_closed/")
      .then((response) => response.data);
  }
}

export default new StatisticService();
