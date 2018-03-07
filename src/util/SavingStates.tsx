export interface Value {
  id: string;
  saveButtonLabel: string;
  transitions: {};
}

export const OK: Value = {
  id: "OK",
  saveButtonLabel: "Save",
  transitions: {},
};

export const SAVING: Value = {
  id: "SAVING",
  saveButtonLabel: "Saving",
  transitions: {},
};

export const SAVE_FAILED: Value = {
  id: "SAVE_FAILED",
  saveButtonLabel: "Saving failed",
  transitions: {},
};
