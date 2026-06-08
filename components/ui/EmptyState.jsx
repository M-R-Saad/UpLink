export default function EmptyState({ icon: Icon, title, description, action }) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        {Icon && <Icon size={48} className="mb-4 opacity-20" style={{ color: "var(--text-sub)" }} />}
        <p className="font-semibold text-lg mb-1" style={{ color: "var(--text)" }}>{title}</p>
        {description && <p className="text-sm mb-5" style={{ color: "var(--text-sub)" }}>{description}</p>}
        {action}
      </div>
    );
  }
  