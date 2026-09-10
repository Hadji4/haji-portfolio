function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AdminAvatar({
  name,
  avatarUrl,
  size = 36,
}: {
  name: string;
  avatarUrl: string | null;
  size?: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-500/30 bg-white/5"
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="font-display font-semibold text-foreground" style={{ fontSize: size * 0.4 }}>
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
