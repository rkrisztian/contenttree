import { useDebouncedCallback } from "@mantine/hooks";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { type ChangeEvent, useCallback, useEffect, useState } from "react";
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";

export const DebouncedTextField = <V extends FieldValues, P extends FieldPath<V>>({
  debounceProps,
  ...props
}: { debounceProps: { field: ControllerRenderProps<V, P>; delayMs: number } } & TextFieldProps) => {
  const { field, delayMs } = debounceProps;
  const [innerValue, setInnerValue] = useState("");

  useEffect(() => {
    if (field.value && typeof field.value === "string") setInnerValue(field.value);
  }, [field.value]);

  const debouncedHandleChange = useDebouncedCallback((event: ChangeEvent<HTMLInputElement>) => {
    field.onChange(event);
    field.onBlur();
  }, delayMs);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      event.persist();
      setInnerValue(event.target.value);
      debouncedHandleChange(event);
    },
    [debouncedHandleChange],
  );

  return <TextField {...props} {...field} onChange={handleChange} value={innerValue}></TextField>;
};
