# React Slots

React slots lets you distribute you content across your component in a similar way you would do it with [Vuejs named slots](https://vuejs.org/guide/components/slots.html#named-slots).

## Install

```shell
yarn add react-typed-slots
```

`react-typed-slots` has `react@>=17` as peerDependency.

## How to use

Firs, you need to create a slottable Component

_Modal.tsx_
```tsx
import { createSlotter } from 'react-typed-slots';

const { makeSlottable, useSlots } = createSlotter('Header', 'Body', 'Footer');

const Modal = makeSlottable(function BaseModal({ showFooter }: { showFooter: boolean }) {
  const { header, body, footer } = useSlots();

  return (
    <div className="modal-container">
      <div className="modal-header">{header}</div>
      <div className="modal-body">{body}</div>
      {showFooter && <div className="modal-footer">{footer}</div>}
    </div>
  )
});
```

Then, you can import it and use it in another component

_App.ts_
```tsx
import { Modal } from './path/to/Modal.tsx';

export function App() {
  return (
    <Modal showFooter={false}>
      <Modal.Header>My modal header</Modal.Header>
      <Modal.Body>The content of my modal</Modal.Body>
      <Modal.Footer>The footer</Modal.Footer>
    </Modal>
  )
}
```

## API

### `createSlotter`

Returns a Slotter object with a HOC and a hook which lets you add/retrieve slots to a Component

```ts
import { createSlotter } from 'react-typed-slots';

const { makeSlottable, useSlots } = createSlotter('Foo', 'Bar');
```

### `createSlotter().makeSlottable`

Takes a component and returns a new component with extra properties for slotting

```tsx
import { createSlotter } from 'react-typed-slots';

const { makeSlottable } = createSlotter('Foo', 'bar');

const MySlottableComponent = makeSlottable(() => <div>Hello</div>);

// Available components
// <MySlottableComponent>
// <MySlottableComponent.Foo>
// <MySlottableComponent.Bar>
```

### `createSlotter().useSlots`

Takes a component and returns a new component with extra properties for slotting

```tsx
import { createSlotter } from 'react-typed-slots';

const { makeSlottable, useSlots } = createSlotter('Foo', 'bar');

const MySlottableComponent = makeSlottable(() => {
  const { foo, bar } = useSlots(); // `foo` and `bar` are of type ReactNode
  
  return <>{foo} - {bar}</>
});
```