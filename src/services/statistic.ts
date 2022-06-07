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
} from "@/types/statistic";
import axios from "axios";

class StatisticService {
  getUserActionsMonth() {
    return axios
      .get<UserAction[]>("rlc_statistics/user_actions_month/")
      .then((response) => response.data);
  }

  //   getRlcMembers() {
  //     return axios
  //       .get<RlcMember[]>("rlc_statistics/rlc_members/")
  //       .then((response) => response.data);
  //   }

  getRecordStates() {
    return axios
      .get<RecordState[]>("rlc_statistics/record_states/")
      .then((response) => response.data);
  }

  //   getLcUsage() {
  //     return axios
  //       .get<LcUsage[]>("rlc_statistics/lc_usage/")
  //       .then((response) => response.data);
  //   }

  //   getUserLogins() {
  //     return axios
  //       .get<UserLogin[]>("rlc_statistics/user_logins/")
  //       .then((response) => response.data);
  //   }

  //   getUserLoginsMonth() {
  //     return axios
  //       .get<UserLoginMonth[]>("rlc_statistics/user_logins_month/")
  //       .then((response) => response.data);
  //   }

  //   getUniqueUsersMonth() {
  //     return axios
  //       .get<UserLoginMonth[]>("rlc_statistics/unique_users_month/")
  //       .then((response) => response.data);
  //   }

  //   getErrors() {
  //     return axios
  //       .get<ErrorMonth[]>("rlc_statistics/errors_month/")
  //       .then((response) => response.data);
  //   }

  //   getUserErrors() {
  //     return axios
  //       .get<ErrorUser[]>("rlc_statistics/errors_user/")
  //       .then((response) => response.data);
  //   }

  //   getRawNumbers() {
  //     return axios
  //       .get<RawNumbers>("rlc_statistics/raw_numbers/")
  //       .then((response) => response.data);
  //   }

  getRecordClientSex() {
    return axios
      .get<RecordClientValueCount[]>("rlc_statistics/record_client_sex/")
      .then((response) => response.data);
  }

  getRecordClientNationality() {
    return axios
      .get<RecordClientValueCount[]>(
        "rlc_statistics/record_client_nationality/",
      )
      .then((response) => response.data);
  }

  getRecordClientState() {
    return axios
      .get<RecordClientValueCount[]>("rlc_statistics/record_client_state/")
      .then((response) => response.data);
  }

  getRecordClientAge() {
    return axios
      .get<RecordClientValueCount[]>("rlc_statistics/record_client_age/")
      .then((response) => response.data);
  }

  getRecordsTagData(): Promise<TagCount[]> {
    return axios
      .get<RecordTagStats>("rlc_statistics/tag_stats/")
      .then((response) => {
        const ret = response.data["tags"];
        ret.push({
          tag: "Unknown",
          count: response.data["state"][1]["count"],
        });
        return ret;
      });
  }
}

export default new StatisticService();
