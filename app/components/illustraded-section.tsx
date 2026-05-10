function Text({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-stone-500 dark:text-stone-400">{children}</div>
  );
}

function Media({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-stone-200 dark:bg-stone-600 rounded p-2 mt-2">
      {children}
    </div>
  );
}

export default function IllustradedSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col justify-between">{children}</div>;
}

IllustradedSection.Text = Text;
IllustradedSection.Media = Media;
