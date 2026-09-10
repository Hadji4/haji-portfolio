import {
  Hospital,
  Store,
  Pill,
  FolderGit2,
  CalendarClock,
  Users,
  Award,
  type LucideIcon,
} from "lucide-react";

const KEYWORD_ICONS: [RegExp, LucideIcon][] = [
  [/hospital/i, Hospital],
  [/wholesale|store|shop/i, Store],
  [/pharmac/i, Pill],
  [/project/i, FolderGit2],
  [/year|experience/i, CalendarClock],
  [/client|patient|user/i, Users],
];

export function getStatIcon(label: string): LucideIcon {
  const match = KEYWORD_ICONS.find(([pattern]) => pattern.test(label));
  return match ? match[1] : Award;
}
