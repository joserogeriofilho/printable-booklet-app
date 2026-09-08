function Text({ children }: { children: React.ReactNode }) {
  return (
    <div>{children}</div>
  );
}

function Media({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-2 mt-2">
      {children}
    </div>
  );
}

export default function IllustratedSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col justify-between">{children}</div>;
}

IllustratedSection.Text = Text;
IllustratedSection.Media = Media;
