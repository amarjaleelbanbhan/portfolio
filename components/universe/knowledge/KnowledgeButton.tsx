"use client";

import { useUniverseStore } from "@/store/universeStore";
import s from "./knowledge.module.css";

/** Persistent shell access to the Knowledge Mastery panel (top-right). */
export default function KnowledgeButton() {
  const open = useUniverseStore((st) => st.knowledgeOpen);
  const toggle = useUniverseStore((st) => st.toggleKnowledge);

  return (
    <button
      type="button"
      className={s.trigger}
      aria-expanded={open}
      aria-label="Open Knowledge Mastery"
      onClick={() => toggle(true)}
    >
      ✦ MASTERY
    </button>
  );
}
