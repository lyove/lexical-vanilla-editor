/**
 * ContentEditable.
 *
 */

import Dom from "../helper/Dom";

export function ContentEditable(
  editor,
  {
    ariaActiveDescendantID,
    ariaAutoComplete,
    ariaControls,
    ariaDescribedBy,
    ariaExpanded,
    ariaLabel,
    ariaLabelledBy,
    ariaMultiline,
    ariaOwneeID,
    ariaRequired,
    autoCapitalize,
    autoComplete,
    autoCorrect,
    className,
    id,
    role = "textbox",
    spellCheck = true,
    style,
    tabIndex,
    testid,
  },
) {
  const isEditable = editor.isEditable();
  return Dom.createElement("div", {
    attributes: {
      "aria-activedescendant": !isEditable ? null : ariaActiveDescendantID,
      "aria-autocomplete": !isEditable ? null : ariaAutoComplete,
      "aria-controls": !isEditable ? null : ariaControls,
      "aria-describedby": ariaDescribedBy,
      "aria-expanded": !isEditable ? null : role === "combobox" ? !!ariaExpanded : null,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-multiline": ariaMultiline,
      "aria-owns": !isEditable ? null : ariaOwneeID,
      "aria-required": ariaRequired,
      autoCapitalize: autoCapitalize !== undefined ? String(autoCapitalize) : undefined,
      autoComplete: autoComplete,
      autoCorrect: autoCorrect !== undefined ? String(autoCorrect) : undefined,
      className: className,
      contentEditable: isEditable,
      "data-testid": testid,
      id: id,
      role: !isEditable ? undefined : role,
      spellCheck: spellCheck,
      style: style,
      tabIndex: tabIndex,
    },
  });
}
