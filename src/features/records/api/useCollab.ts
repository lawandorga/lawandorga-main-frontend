// interface Letterhead {}

// interface Footer {}

export type CollabTemplates = Array<{
  title: string;
  description: string;
  uuid: string; // TODO: string or number?
}>;

const useCollab = () => {
  const getTemplates = (): CollabTemplates => {
    // TODO: get real ones
    return [
      {
        title: "Letterhead RLC",
        description:
          "For outgoing communication to other RLCs and other people",
        uuid: "abc",
      },
      {
        title: "Default template",
        description: "The usual",
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
