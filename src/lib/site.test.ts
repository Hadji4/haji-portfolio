import { describe, it, expect } from "vitest";
import { toSafeJsonLd } from "./site";

describe("toSafeJsonLd", () => {
  it("produces valid, parseable JSON", () => {
    const data = { name: "Haji", tags: ["a", "b"] };
    expect(JSON.parse(toSafeJsonLd(data))).toEqual(data);
  });

  it("neutralizes a </script> breakout attempt", () => {
    const data = { title: "</script><script>alert(1)</script>" };
    const out = toSafeJsonLd(data);
    expect(out).not.toContain("</script>");
    expect(out).toContain("\\u003c/script>");
    expect(JSON.parse(out)).toEqual(data);
  });
});
