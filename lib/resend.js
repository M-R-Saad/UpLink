import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendJobAlertEmail({ to, userName, job, company }) {
  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL || "alerts@uplink.dev",
    to,
    subject: `New Job Match: ${job.title} at ${company.name}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#e8520a">New Job Alert — UpLink</h2>
      <p>Hi ${userName}, a new matching job was just posted:</p>
      <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:16px 0">
        <h3 style="margin:0 0 8px">${job.title}</h3>
        <p style="color:#6b7280">${company.name} · ${job.location || "Remote"}</p>
        <a href="${process.env.NEXTAUTH_URL}/jobs/${job._id}"
          style="display:inline-block;margin-top:16px;background:#e8520a;color:white;padding:10px 20px;border-radius:8px;text-decoration:none">
          View Job
        </a>
      </div>
      <p style="color:#9ca3af;font-size:12px">
        <a href="${process.env.NEXTAUTH_URL}/dashboard/alerts">Manage alerts</a>
      </p>
    </div>`,
  });
}

export async function sendWelcomeEmail({ to, name, role }) {
  await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL || "hello@uplink.dev",
    to,
    subject: "Welcome to UpLink 🎉",
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#e8520a">Welcome to UpLink, ${name}!</h2>
      <p>${role === "jobseeker" ? "Start exploring jobs and build your resume." : "Start posting jobs and find great talent."}</p>
      <a href="${process.env.NEXTAUTH_URL}"
        style="display:inline-block;margin-top:16px;background:#e8520a;color:white;padding:10px 20px;border-radius:8px;text-decoration:none">
        Get Started
      </a>
    </div>`,
  });
}

export default resend;
