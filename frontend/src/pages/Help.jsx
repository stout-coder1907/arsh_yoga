export default function Help() {
  return (
    <section className="container-x py-24">
      <div className="max-w-3xl mx-auto">
        <div className="eyebrow mb-3">Help</div>
        <h1 className="font-serif text-4xl text-forest leading-tight mb-6">Need help?</h1>
        <p className="text-charcoal/75 text-lg leading-relaxed mb-8">
          If you need assistance with signup, programs, or account access, we’re here to support you.
          Reach out to our team and we’ll help you find the right next step.
        </p>
        <div className="space-y-3 text-sm text-charcoal/80">
          <p><strong>Email:</strong> <a href="mailto:hello@arshyoga.example" className="text-forest underline">hello@arshyoga.example</a></p>
          <p><strong>Contact:</strong> <a href="/contact" className="text-forest underline">Contact page</a></p>
          <p><strong>FAQ:</strong> Visit the homepage FAQ section for common questions.</p>
        </div>
      </div>
    </section>
  );
}
