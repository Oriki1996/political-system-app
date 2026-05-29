import type { Unit, UnitMeta } from "../types";
import { unit01Meta } from "./units/unit01/meta";
import { unit02Meta } from "./units/unit02/meta";
import { unit03Meta } from "./units/unit03/meta";
import { unit04Meta } from "./units/unit04/meta";
import { unit05Meta } from "./units/unit05/meta";
import { unit06Meta } from "./units/unit06/meta";
import { unit07Meta } from "./units/unit07/meta";
import { unit08Meta } from "./units/unit08/meta";
import { unit09Meta } from "./units/unit09/meta";
import { unit10Meta } from "./units/unit10/meta";

/**
 * Eager, lightweight unit metadata — used by the dashboard and header.
 * The heavy content (sections, quiz, keyTerms) is loaded on demand via `loadUnit`,
 * so the initial bundle does not ship all 10 units' content.
 */
export const UNIT_METAS: UnitMeta[] = [
  unit01Meta, unit02Meta, unit03Meta, unit04Meta, unit05Meta,
  unit06Meta, unit07Meta, unit08Meta, unit09Meta, unit10Meta,
].sort((a, b) => a.number - b.number);

/** Per-unit dynamic importers — each resolves to its own code-split chunk. */
const loaders: Record<string, () => Promise<Record<string, unknown>>> = {
  unit01: () => import("./units/unit01"),
  unit02: () => import("./units/unit02"),
  unit03: () => import("./units/unit03"),
  unit04: () => import("./units/unit04"),
  unit05: () => import("./units/unit05"),
  unit06: () => import("./units/unit06"),
  unit07: () => import("./units/unit07"),
  unit08: () => import("./units/unit08"),
  unit09: () => import("./units/unit09"),
  unit10: () => import("./units/unit10"),
};

/** Lazily load a unit's full content by id (e.g. "unit06"). */
export async function loadUnit(id: string): Promise<Unit> {
  const loader = loaders[id];
  if (!loader) throw new Error(`Unknown unit id: ${id}`);
  const mod = await loader();
  const unit = (mod[id] ?? mod.default) as Unit | undefined;
  if (!unit) throw new Error(`Unit module "${id}" has no export named "${id}"`);
  return unit;
}
