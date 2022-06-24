import {
  ReactNode,
  ReactElement,
  useState,
  useEffect,
  useContext,
  useCallback,
  Children,
} from "react";
import { createSlotContext } from "./context";
import {
  SlotElementProps,
  SlotIdentifier,
  SlotRef,
  Slots,
  SlotsDescriptorMap,
} from "./types";

type ComponentType<P = {}> = {
  (props: P): ReactElement | null;
  displayName?: string;
};

type ExtractProps<Component extends ComponentType> = Component extends (
  props: infer P
) => ReactElement | null
  ? P
  : never;

type SlottedComponentProps<Component extends ComponentType> = {
  children?: ReactNode;
} & Omit<ExtractProps<Component>, "children">;

type SlottedComponentInterface<
  C extends ComponentType,
  S extends SlotIdentifier[]
> = {
  [K in Capitalize<S[number]>]: SlotRef["Element"];
} & ComponentType<SlottedComponentProps<C>>;

function getComponentName(Component: ComponentType) {
  return Component.displayName ?? Component.name;
}

function initializeSlots<S extends SlotIdentifier[]>(slotsNames: S): Slots<S> {
  const entries = slotsNames.map((n) => [uncapitalize(n), null]);
  return Object.fromEntries(entries) as Slots<S>;
}

function capitalize<S extends string>(s: S): Capitalize<S> {
  return (s.charAt(0)?.toUpperCase() + s.slice(1)) as Capitalize<S>;
}

function uncapitalize<S extends string>(s: S): Uncapitalize<S> {
  return (s.charAt(0)?.toLowerCase() + s.slice(1)) as Uncapitalize<S>;
}

function isElement(element: {} | null | undefined): element is ReactElement {
  return !!element && element.hasOwnProperty("type");
}

export function createSlotter<S extends SlotIdentifier[]>(...slotsNames: S) {
  const SlotContext = createSlotContext(slotsNames);

  function createSlot(id: SlotIdentifier): SlotRef {
    const $$identifier = id;

    const Element = ({ children }: SlotElementProps) => {
      const ctx = useContext(SlotContext);

      useEffect(() => {
        if (!ctx) {
          throw new Error(
            "SlotRef.Element must be used as children of a slotted component"
          );
        }

        ctx.setSlot($$identifier, children);
      }, [children, ctx]);

      return null;
    };

    return {
      Element,
      get $$identifier() {
        return $$identifier;
      },
    };
  }

  const useSlots = (): Slots<S> => {
    const ctx = useContext<any>(SlotContext);
    if (!ctx) {
      throw new Error("");
    }

    return ctx.slots;
  };

  const makeSlottable = function <C extends ComponentType>(
    Component: C
  ): SlottedComponentInterface<C, S> {
    const slotsRefs = slotsNames.map((slotName) => createSlot(slotName));
    const descriptor: SlotsDescriptorMap<S> = {};
    for (const slotName of slotsNames) {
      const slotRef = slotsRefs.find((s) => s.$$identifier === slotName);
      if (!slotRef) {
        throw new Error(
          `Something went wrong when trying to get reference for slot "${slotName}"`
        );
      }
      descriptor[capitalize(slotName) as Capitalize<S[number]>] = {
        value: slotRef.Element,
        writable: false,
      };
    }

    const SlottedComponent: ComponentType<SlottedComponentProps<C>> =
      function SlottedComponent({
        children: passedChildren,
        ...props
      }: SlottedComponentProps<typeof Component>) {
        const children = Children.toArray(passedChildren).map((child) => {
          if (!isElement(child)) return null;
          return slotsRefs.find((s) => s.Element === child.type) ? child : null;
        });
        const [slots, setSlots] = useState<Slots<S>>(() =>
          initializeSlots(slotsNames)
        );
        const setSlot = useCallback((id: S[number], node: ReactNode) => {
          setSlots((currentSlots) => {
            const uncapitalizedSlotName = uncapitalize(id);
            if (currentSlots[uncapitalizedSlotName] === node)
              return currentSlots;

            return {
              ...currentSlots,
              [uncapitalizedSlotName]: node,
            };
          });
        }, []);

        return (
          <SlotContext.Provider value={{ slots, setSlot }}>
            {children}
            <Component {...(props as any)} />
          </SlotContext.Provider>
        );
      };
    SlottedComponent.displayName = `Slotted(${getComponentName(Component)})`;

    return Object.defineProperties(
      SlottedComponent as SlottedComponentInterface<C, S>,
      descriptor as PropertyDescriptorMap
    );
  };

  return { makeSlottable, useSlots };
}
