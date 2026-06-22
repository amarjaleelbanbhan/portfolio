import UniverseGate from "@/components/universe/UniverseGate";

/**
 * The universe entry. Phase 1: the Boot Sequence (Human → Machine → Universe).
 * UniverseGate (client) runs the boot and prepares the handoff state.
 * The Universe Map (Phase 2) replaces the handoff stub.
 */
export default function UniverseEntry() {
  return <UniverseGate />;
}
