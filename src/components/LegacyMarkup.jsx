// Keeps the already-approved section markup intact during the tech-stack migration.
export default function LegacyMarkup({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
