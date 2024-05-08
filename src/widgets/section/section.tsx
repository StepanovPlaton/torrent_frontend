export const Section = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  return (
    // open section onClick
    <section className="w-full mt-8 cursor-pointer">
      <h2 className="text-4xl">{name}</h2>
      <div>{children}</div>
    </section>
  );
};
