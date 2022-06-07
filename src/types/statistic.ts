export interface RecordState {
  state: string;
  amount: number;
}

export interface RecordClientValueCount {
  value: string;
  count: number;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface RecordTagStats {
  tags: TagCount[];
  state: [
    { state: "Set"; count: number },
    { state: "Not-Existing"; count: number },
  ];
}

export interface UserAction {
  email: string;
  actions: number;
}
