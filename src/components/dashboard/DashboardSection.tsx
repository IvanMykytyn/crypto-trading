type Props = {
  title: string;
  children: React.ReactNode;
};

export const DashboardSection: React.FC<Props> = ({ title, children }) => {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
};
