// app/users/lessons/layout.tsx
export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* This layout does nothing but pass through children */}
      {/* The conditional logic in the parent layout handles the rendering */}
      {children}
    </>
  );
}