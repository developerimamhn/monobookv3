/** Small section label, e.g. "The problem". Sentence case, Muted. */
export function Label({ children, index }: { children: string; index?: string }) {
  return (
    <p className="label">
      {index ? <span className="label-index">{index}</span> : null}
      {children}
    </p>
  );
}
