import axios from "axios";

interface Group {
  id: number;
  name: string;
  creator_id: string;
  members: number[];
  visible: boolean;
  description: string;
  note: string;
}

class CoreService {
  getGroups(): Promise<Group[]> {
    return axios
      .get<Group[]>("org/query/groups/")
      .then((response) => response.data);
  }
}

const Core = new CoreService();

export default Core;
