export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`app-logo${compact ? " app-logo--compact" : ""}`}>
      <span className="app-logo__mark" aria-hidden="true">X</span>
      {!compact && <span className="app-logo__name">Xeno</span>}
    </div>
  );
}
