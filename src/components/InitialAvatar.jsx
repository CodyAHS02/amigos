export default function InitialAvatar({ name = "Amigos", className = "" }) {
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  return <span className={className}>{initial}</span>;
}
