type SectionHeadProps = {
  index: string;
  label: string;
  inverse?: boolean;
};

export default function SectionHead({
  index,
  label,
  inverse = false,
}: SectionHeadProps) {
  return (
    <div className={`section-head${inverse ? " is-inverse" : ""}`}>
      <span className="section-head-index">{index}</span>
      <span className="section-head-label">{label}</span>
      <span className="section-head-rule" aria-hidden="true" />
    </div>
  );
}
