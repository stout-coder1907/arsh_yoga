export default function Contact() {
  return (
    <section className="container-x py-16 lg:py-24">
      <div className="max-w-3xl">
        <div className="eyebrow mb-3">Contact</div>

        <h1 className="font-serif text-4xl text-forest leading-tight mb-4">
          Get in touch
        </h1>

        <p className="text-charcoal/80 mb-6">
          For program enquiries, partnerships, or support, feel free to reach out.
        </p>

        {/* Contact Details */}
        <div className="space-y-3 text-charcoal/80">
          <p>
            📧 Email:{" "}
            <a
              href="mailto:arshyoga8@gmail.com"
              className="text-forest underline"
            >
              arshyoga8@gmail.com
            </a>
          </p>

          <p>
            📞 WhatsApp:{" "}
            <a
              href="https://wa.me/919264922395"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest underline"
            >
              Chat on WhatsApp
            </a>
          </p>
        </div>

        {/* Button */}
        <div className="mt-6">
          <a
            href="mailto:arshyoga8@gmail.com"
            className="btn-primary inline-block"
          >
            Send Email
          </a>
        </div>
      </div>
    </section>
  );
}