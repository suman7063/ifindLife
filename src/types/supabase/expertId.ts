
// Type helpers for expert IDs
export type ExpertIdDB = number; // How expert_id is stored in the database
export type ExpertIdUI = string; // How expert_id is used in the UI

// Convert database ID to UI ID
export const convertExpertIdToString = (id: ExpertIdDB): ExpertIdUI => {
  return String(id);
};

// Convert UI ID to database ID
export const convertExpertIdToNumber = (id: ExpertIdUI): ExpertIdDB => {
  return Number(id);
};
