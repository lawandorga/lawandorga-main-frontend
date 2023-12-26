import { LegalRequirement } from "@/types/legal";
import axios from "axios";

class LegalService {
  acceptLegalRequirement(lr: LegalRequirement): Promise<void> {
    return axios.post(`legal/legal_requirements/${lr.id}/accept/`).then();
  }
}

export default new LegalService();
