import { ReactNode, createContext, Context } from "react";
import { SlotIdentifier, Slots } from "./types";

export interface SlotContextValue<S> {
  setSlot: (id: SlotIdentifier, node: ReactNode) => void;
  slots: S;
}

export function createSlotContext<S extends SlotIdentifier[]>(slotsNames: S) {
  return createContext<SlotContextValue<Slots<S>> | undefined>(undefined);
}
