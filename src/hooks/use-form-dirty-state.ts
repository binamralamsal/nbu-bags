import { useEffect, useRef, useState } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export function useFormDirtyState<T extends FieldValues>(
  form: UseFormReturn<T>,
) {
  const [isFormEdited, setIsFormEdited] = useState(false);

  const defaultValuesRef = useRef(form.getValues());

  useEffect(() => {
    const subscription = form.watch((values) => {
      const isDirty = Object.keys(values).some(
        (key) => values[key] !== defaultValuesRef.current[key],
      );
      setIsFormEdited(isDirty);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isFormEdited) {
        event.preventDefault();
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isFormEdited]);

  return {
    isFormEdited,
    resetForm: () => {
      form.reset(defaultValuesRef.current);
      setIsFormEdited(false);
    },
    setDirtyState: (state: boolean) => {
      setIsFormEdited(state);
    },
  };
}
