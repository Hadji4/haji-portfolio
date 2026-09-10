import { Mail, Phone, Send } from "lucide-react";
import { Reveal } from "./Reveal";
import { ContactForm } from "./ContactForm";

export function Contact({
  email,
  phone,
  telegram,
}: {
  email: string;
  phone: string;
  telegram?: string | null;
}) {
  return (
    <section id="contact" className="scroll-mt-24 py-16 text-center">
      <Reveal>
        <h2 className="section-heading mx-auto">Get In Touch</h2>
      </Reveal>
      <Reveal delay={0.05}>
        <p className="mx-auto max-w-2xl">
          Interested in discussing how digital health solutions can transform your
          organization? Reach out through any of these channels, or use the form below.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 flex flex-wrap justify-center gap-5">
          <a href={`mailto:${email}`} className="card-surface flex items-center gap-3 rounded-full px-7 py-4">
            <Mail className="text-accent-violet" size={22} />
            <span className="font-medium text-foreground">{email}</span>
          </a>
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="card-surface flex items-center gap-3 rounded-full px-7 py-4">
            <Phone className="text-accent-violet" size={22} />
            <span className="font-medium text-foreground">{phone}</span>
          </a>
          {telegram ? (
            <a href={telegram} target="_blank" rel="noreferrer" className="card-surface flex items-center gap-3 rounded-full px-7 py-4">
              <Send className="text-accent-violet" size={22} />
              <span className="font-medium text-foreground">Telegram</span>
            </a>
          ) : null}
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <ContactForm />
      </Reveal>
    </section>
  );
}
