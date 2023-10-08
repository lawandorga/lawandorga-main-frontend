export const formFieldFields = [
  {
    label: "Type",
    name: "field_type",
    type: "select",
    options: [
      { name: "Text", id: "TEXTAREA" },
      { name: "File", id: "FILE" },
    ],
    required: true,
  },
  {
    label: "Question",
    name: "question",
    type: "textarea",
    required: true,
  },
  {
    label: "Order",
    name: "order",
    type: "number",
    required: true,
    helptext: "The ordering in which the fields appear.",
  },
];
