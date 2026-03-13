interface SectionWrapperProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({ id, title, subtitle, children, className = "" }: SectionWrapperProps) {
  return (
    <section id={id} className={`py-12 ${className}`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="mt-1 text-gray-500">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
