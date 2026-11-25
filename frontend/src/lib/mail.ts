export async function sendMail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`\n[mail] to: ${to}\nsubject: ${subject}\n${text}\n`);
  }
}
