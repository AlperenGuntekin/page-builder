import { ModernOutline } from "../../../ModernOutline";
import { useAppStore } from "../../../../store";
import { useMemo } from "react";

export const Outline = () => {
  const outlineOverride = useAppStore((s) => s.overrides.outline);

  const Wrapper = useMemo(() => outlineOverride || "div", [outlineOverride]);
  
  return (
    <Wrapper>
      <ModernOutline />
    </Wrapper>
  );
};
