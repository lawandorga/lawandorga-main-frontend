// interface Letterhead {}

// interface Footer {}

export type CollabTemplateType = "letterhead" | "footer";

export type CollabTemplates = Array<{
  description: string;
  title: string;
  type: CollabTemplateType;
  uuid: string; // TODO: string or number?
}>;

const useCollab = () => {
  const getTemplates = (): CollabTemplates => {
    // TODO: get real ones
    return [
      {
        description:
          "For outgoing communication to other RLCs and other people",
        title: "Letterhead RLC",
        type: "letterhead",
        uuid: "abc",
      },
      {
        description: "The usual",
        title: "Default template",
        type: "footer",
        uuid: "def",
      },
    ];
  };

  // TODO: create one

  // TODO: delete one

  // TODO: edit one

  return {
    getTemplates,
  };
};

export default useCollab;
