import { Resend } from "resend";
import { render } from "@react-email/components";
import JobAlertEmail from "./templates/jobAlertEmail";
import WelcomeEmail from "./templates/welcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendJobAlertEmail({ to, userName, job, company }) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  let html;
  try {
    html = await render(
      JobAlertEmail({ userName, job, company, baseUrl })
    );
  } catch {
    // Fallback to inline HTML if React Email rendering fails
    html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#e8520a">New Job Alert — UpLink</h2>
      <p>Hi ${userName}, a new matching job was just posted:</p>
      <div style="border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:16px 0">
        <h3 style="margin:0 0 8px">${job.title}</h3>
        <p style="color:#6b7280">${company.name} · ${job.location || "Remote"}</p>
        <a href="${baseUrl}/jobs/${job._id}"
          style="display:inline-block;margin-top:16px;background:#e8520a;color:white;padding:10px 20px;border-radius:8px;text-decoration:none">
          View Job
        </a>
      </div>
      <p style="color:#9ca3af;font-size:12px">
        <a href="${baseUrl}/dashboard/alerts">Manage alerts</a>
      </p>
    </div>`;
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "alerts@uplink.dev",
    to,
    subject: `New Job Match: ${job.title} at ${company.name}`,
    html,
  });
}

export async function sendWelcomeEmail({ to, name, role }) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  let html;
  try {
    html = await render(
      WelcomeEmail({ name, role, baseUrl })
    );
  } catch {
    // Fallback to inline HTML
    html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#e8520a">Welcome to UpLink, ${name}!</h2>
      <p>${role === "jobseeker" ? "Start exploring jobs and build your resume." : "Start posting jobs and find great talent."}</p>
      <a href="${baseUrl}"
        style="display:inline-block;margin-top:16px;background:#e8520a;color:white;padding:10px 20px;border-radius:8px;text-decoration:none">
        Get Started
      </a>
    </div>`;
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "hello@uplink.dev",
    to,
    subject: "Welcome to UpLink 🎉",
    html,
  });
}

export default resend;
