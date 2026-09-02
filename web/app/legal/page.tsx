export default function LegalPage() {
  return (
    <main className="pageShell legalPage">
      <section className="editorialHeader">
        <p className="eyebrow">TRANSPARENCY</p>
        <h1>Clear identity. Clear boundaries.</h1>
        <p className="lede">This MVP defines the product surfaces that must exist before real monetization is activated.</p>
      </section>

      <section className="legalSections">
        <article>
          <h2>AI disclosure</h2>
          <p>Mara Vera is a fictional, AI-generated virtual character. She is not a real human person.</p>
        </article>
        <article>
          <h2>Adults only</h2>
          <p>The experience is intended for adults aged 18 and over. Adult-oriented premium paths must not be accessed by minors.</p>
        </article>
        <article>
          <h2>Consent and boundaries</h2>
          <p>More intense or roleplay-oriented experiences require active user choice. Users can stop or decline at any time.</p>
        </article>
        <article>
          <h2>Pricing</h2>
          <p>Paid experiences must display price and scope before purchase. This branch does not activate real payments.</p>
        </article>
        <article>
          <h2>Privacy</h2>
          <p>Only data required for a defined product purpose should be collected. Sensitive conversation content must not be sent to general analytics tools.</p>
        </article>
        <article>
          <h2>Reporting and deletion</h2>
          <p>Before launch, a working contact path for abuse reports, impersonation concerns and data/deletion requests must be configured.</p>
        </article>
      </section>
      <p className="legalNote">These MVP disclosures are product requirements and must be replaced or supplemented by launch-jurisdiction legal terms before production activation.</p>
    </main>
  );
}
