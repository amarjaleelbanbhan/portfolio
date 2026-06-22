"use client";

import type { Realm } from "@/lib/realms";
import type { RealmContent } from "./realmContent";
import s from "./realm.module.css";

/** Realm title block — identity, name, message, atmosphere. Reusable. */
export default function RealmHeader({
  realm,
  content,
}: {
  realm: Realm;
  content: RealmContent;
}) {
  return (
    <header className={s.header}>
      <p className={s.kicker}>
        {realm.identity} · {realm.subtitle}
      </p>
      <h1 className={s.title}>{realm.name}</h1>
      <p className={s.message}>“{content.message}”</p>
      <p className={s.atmosphere}>{content.atmosphere}</p>
    </header>
  );
}
