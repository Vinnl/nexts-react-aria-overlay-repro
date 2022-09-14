/* eslint-disable react/display-name */
import React from "react";
import {
  DismissButton,
  FocusScope,
  mergeProps,
  OverlayContainer,
  OverlayProvider,
  useDialog,
  useModal,
  useOverlay,
  useOverlayPosition,
  useOverlayTrigger,
  useButton
} from "react-aria";

import { useOverlayTriggerState } from "react-stately";

export default function App() {
  return (
    <OverlayProvider>
      <Example />
    </OverlayProvider>
  );
}

const Popover = React.forwardRef(
  ({ title, children, isOpen, onClose, style, ...otherProps }, ref) => {
    // Handle interacting outside the dialog and pressing
    // the Escape key to close the modal.
    let { overlayProps } = useOverlay(
      {
        onClose,
        isOpen,
        isDismissable: true
      },
      ref
    );

    // Hide content outside the modal from screen readers.
    let { modalProps } = useModal();

    // Get props for the dialog and its title
    let { dialogProps, titleProps } = useDialog({}, ref);

    return (
      <FocusScope restoreFocus>
        <div
          {...mergeProps(overlayProps, dialogProps, otherProps, modalProps)}
          ref={ref}
          style={{
            background: "white",
            color: "black",
            padding: 30,
            ...style
          }}
        >
          <h3 {...titleProps} style={{ marginTop: 0 }}>
            {title}
          </h3>
          {children}
          <DismissButton onDismiss={onClose} />
        </div>
      </FocusScope>
    );
  }
);

function Example() {
  let state = useOverlayTriggerState({});

  let triggerRef = React.useRef(null);
  let overlayRef = React.useRef(null);

  // Get props for the trigger and overlay. This also handles
  // hiding the overlay when a parent element of the trigger scrolls
  // (which invalidates the popover positioning).
  let { triggerProps, overlayProps } = useOverlayTrigger(
    { type: "dialog" },
    state,
    triggerRef
  );

  // Get popover positioning props relative to the trigger
  let { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    placement: "top",
    offset: 5,
    isOpen: state.isOpen
  });
  console.log("RERENDER", state, positionProps, triggerProps, overlayProps);
  if (state.isOpen) {
    console.log(
      "Position props, which do not include `left` and `top` styles:",
      positionProps
    );
  }

  let { buttonProps } = useButton(triggerProps, triggerRef);

  return (
    <>
      <button {...buttonProps} ref={triggerRef}>
        Open Popover
      </button>
      {state.isOpen && (
        <OverlayContainer>
          <Popover
            {...overlayProps}
            {...positionProps}
            ref={overlayRef}
            // title="Popover title"
            isOpen={state.isOpen}
            onClose={state.close}
          >
            This is the content of the popover.
          </Popover>
        </OverlayContainer>
      )}
    </>
  );
}
