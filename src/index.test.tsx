import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createSlotter } from ".";

describe("createSlotter", () => {
  it("Should return an object with 2 function", () => {
    const { makeSlottable, useSlots } = createSlotter("Foo", "Bar");

    expect(makeSlottable).toBeInstanceOf(Function);
    expect(useSlots).toBeInstanceOf(Function);
  });

  describe("createSlotter.makeSlottable", () => {
    it("should wrap the component and show it properly", () => {
      const { makeSlottable } = createSlotter();

      const MyComponent = () => <div>Hello world</div>;

      const SlottableComponent = makeSlottable(MyComponent);
      const { getByText } = render(<SlottableComponent />);

      expect(getByText("Hello world")).toBeDefined();
    });
  });

  describe("createSlotter.useSlots", () => {
    it("should return a map of slots named with the names passed to createSlotter", () => {
      const { makeSlottable, useSlots: baseUseSlots } = createSlotter("Foo");
      const useSlots = vi.fn(baseUseSlots);

      const MyComponent = () => {
        const { foo } = useSlots();
        return <div>{foo}</div>;
      };

      const SlottableComponent = makeSlottable(MyComponent);
      render(
        <SlottableComponent>
          <SlottableComponent.Foo>Foo content</SlottableComponent.Foo>
        </SlottableComponent>
      );

      expect(useSlots).toHaveReturnedWith(
        expect.objectContaining({ foo: expect.anything() })
      );
    });
  });

  describe("createSlotter.makeSlottable", () => {
    it("should wrap the component and show it properly and let it use slots", () => {
      const { makeSlottable, useSlots } = createSlotter("Foo");

      const MyComponent = () => {
        const { foo } = useSlots();
        return <div>{foo}</div>;
      };

      const SlottableComponent = makeSlottable(MyComponent);
      const { queryByText, rerender } = render(
        <SlottableComponent>
          <div>Foo content</div>
        </SlottableComponent>
      );

      expect(queryByText("Foo content")).toBeNull();

      rerender(
        <SlottableComponent>
          <SlottableComponent.Foo>Foo content</SlottableComponent.Foo>
        </SlottableComponent>
      );

      expect(queryByText("Foo content")).not.toBeNull();
    });
  });
});
