import { ReactNode } from "react";

export type SlotIdentifier = string;

export type SlotRef = {
  Element: (props: SlotElementProps) => null;
  $$identifier: SlotIdentifier;
};

export type SlotElementProps = { children: ReactNode };

export type Slots<S extends SlotIdentifier[]> = {
  [K in Uncapitalize<S[number]>]: ReactNode;
};

export type SlotsDescriptorMap<S extends SlotIdentifier[]> = {
  [K in Capitalize<S[number]>]+?: {
    value: SlotRef["Element"];
    writable: boolean;
  };
};
