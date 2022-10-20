import { LegalRequirement } from "@/types/legal";
import axios from "axios";

class LegalService {
  getLegalRequirements(): Promise<LegalRequirement[]> {
    return axios
      .get<LegalRequirement[]>("legal/legal_requirements/")
      .then((response) => response.data);
  }

  acceptLegalRequirement(lr: LegalRequirement): Promise<void> {
    return axios.post(`legal/legal_requirements/${lr.id}/accept/`).then();
  }
}

export default new LegalService();
