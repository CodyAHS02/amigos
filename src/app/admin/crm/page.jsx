import AdminShell from "@/components/admin/AdminShell";
import { getAdminCrmData } from "@/lib/adminStore";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import styles from "@/components/admin/Admin.module.css";

const stages = [
  { key: "NEW_LEAD", label: "New Leads" },
  { key: "QUALIFIED", label: "Qualified" },
  { key: "ESTIMATE_SENT", label: "Estimate Sent" },
  { key: "IN_PROGRESS", label: "In Progress" },
  { key: "COMPLETED", label: "Completed" }
];

function readableList(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replaceAll(",", ", ")
    .replace(/\s+/g, " ")
    .trim();
}

export const metadata = {
  title: "CRM | Amigos Maler",
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = "force-dynamic";

export default async function AdminCrmPage() {
  const admin = await getCurrentAdmin();
  const { notes, projects, tasks } = await getAdminCrmData();
  const activeProjects = projects.filter((project) => !["COMPLETED", "LOST"].includes(project.stage));
  const stageMetrics = stages.map((stage) => ({
    ...stage,
    count: projects.filter((project) => project.stage === stage.key).length
  }));

  return (
    <AdminShell activePath="/admin/crm" admin={admin} eyebrow="Pipeline" title="CRM">
      <section className={styles.crmHero}>
        <div>
          <span className={styles.eyebrow}>Amigos Operations CRM</span>
          <h2>Requests, properties, estimates, and renovation work in one pipeline.</h2>
        </div>
        <div className={styles.crmHeroMeta}>
          <strong>{activeProjects.length}</strong>
          <span>active opportunities</span>
        </div>
      </section>

      <section className={styles.stageStrip} aria-label="Pipeline stage summary">
        {stageMetrics.map((stage) => (
          <div className={styles.stageMetric} key={stage.key}>
            <span>{stage.label}</span>
            <strong>{stage.count}</strong>
          </div>
        ))}
      </section>

      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2>Project Pipeline</h2>
            <p>Lead status, customer context, service type, and latest request detail.</p>
          </div>
        </div>

        <table className={styles.crmTable}>
          <thead>
            <tr>
              <th>Project</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Stage</th>
              <th>Workflow</th>
              <th>Estimate</th>
              <th>Priority</th>
              <th>Photos</th>
              <th>Request Detail</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td className={styles.projectCell}>
                  <strong>{project.title}</strong>
                  <span>{project.email}</span>
                </td>
                <td className={styles.customerCell}>{project.customerName || "Unassigned lead"}</td>
                <td className={styles.serviceCell}>{readableList(project.service)}</td>
                <td>
                  <span className={styles.stagePill}>{project.stageLabel}</span>
                </td>
                <td className={styles.workflowCell}>{project.workflow || "Review"}</td>
                <td className={styles.estimateCell}>{project.estimateRange}</td>
                <td className={styles.priorityCell}>{project.priority}</td>
                <td className={styles.photoCell}>{project.photoCount}</td>
                <td className={styles.messageCell}>{project.message || "No project notes yet."}</td>
                <td className={styles.dateCell}>{project.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.crmActivityGrid}>
        <article className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div>
              <h2>Open Tasks</h2>
              <p>Follow-ups for active project work.</p>
            </div>
          </div>
          <table className={styles.table}>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.projectTitle}</td>
                  <td>{task.due}</td>
                  <td>{task.statusLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div>
              <h2>Recent Notes</h2>
              <p>Internal project history and context.</p>
            </div>
          </div>
          <table className={styles.table}>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id}>
                  <td>{note.projectTitle}</td>
                  <td className={styles.messageCell}>{note.body}</td>
                  <td>{note.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
      </section>
    </AdminShell>
  );
}
