/**
 * Email template rendering helper.
 * Supports merge fields like {{hotel_name}}, {{city}}, {{website}}, {{email}}.
 */

export interface TemplateContext {
  name: string;
  city: string;
  website?: string | null;
  email?: string | null;
  address?: string | null;
  phone?: string | null;
  [key: string]: string | null | undefined;
}

/**
 * Replaces {{variable}} merge fields in a template string.
 */
export function renderTemplate(template: string, context: TemplateContext): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = context[key];
    return value != null ? String(value) : `{{${key}}}`;
  });
}

/**
 * Generates an unsubscribe URL for the given lead email.
 * The URL is signed with a simple token derived from the email.
 */
export function generateUnsubscribeUrl(leadId: string, baseUrl: string): string {
  return `${baseUrl}/api/unsubscribe?leadId=${encodeURIComponent(leadId)}`;
}

/**
 * Injects the unsubscribe footer into an HTML email body.
 */
export function injectUnsubscribeFooter(htmlBody: string, unsubscribeUrl: string): string {
  const footer = `
<br><br>
<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
<p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">
  You are receiving this email because your business was identified as a potential partner.<br>
  <a href="${unsubscribeUrl}" style="color:#6b7280">Unsubscribe</a>
</p>`;
  return htmlBody + footer;
}
