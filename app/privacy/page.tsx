export default function PrivacyPage() {
  return (
    <div className="container">
      <div className="privacy-container">
        <h1 className="privacy-title">Privacy Policy</h1>
        <div className="privacy-content">
          <section className="privacy-section">
            <h2>Introduction</h2>
            <p>
              Welcome to Sydney Event Scraper. We respect your privacy and are committed to protecting your personal
              data. This privacy policy will inform you about how we look after your personal data when you visit our
              website and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="privacy-section">
            <h2>The Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped
              together as follows:
            </p>
            <ul className="privacy-list">
              <li>
                <strong>Identity Data</strong> includes first name, last name, username or similar identifier.
              </li>
              <li>
                <strong>Contact Data</strong> includes email address and telephone numbers.
              </li>
              <li>
                <strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type
                and version, time zone setting and location, browser plug-in types and versions, operating system and
                platform, and other technology on the devices you use to access this website.
              </li>
              <li>
                <strong>Usage Data</strong> includes information about how you use our website, products and services.
              </li>
              <li>
                <strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from
                us and our third parties and your communication preferences.
              </li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal
              data in the following circumstances:
            </p>
            <ul className="privacy-list">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
              <li>
                Where it is necessary for our legitimate interests (or those of a third party) and your interests and
                fundamental rights do not override those interests.
              </li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>
            <p>
              Generally, we do not rely on consent as a legal basis for processing your personal data although we will
              get your consent before sending third party direct marketing communications to you via email or text
              message. You have the right to withdraw consent to marketing at any time by contacting us.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Email Marketing</h2>
            <p>
              If you opt-in to receive marketing emails from us, we will send you updates about events and offers that
              may interest you. You can opt-out of receiving these emails at any time by:
            </p>
            <ul className="privacy-list">
              <li>Clicking the "unsubscribe" link in any marketing email we send you</li>
              <li>
                Visiting our{" "}
                <a href="/unsubscribe" className="text-primary">
                  unsubscribe page
                </a>
              </li>
              <li>Contacting us directly</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally
              lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your
              personal data to those employees, agents, contractors and other third parties who have a business need to
              know. They will only process your personal data on our instructions and they are subject to a duty of
              confidentiality.
            </p>
          </section>

          <section className="privacy-section">
            <h2>Your Legal Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data,
              including the right to:
            </p>
            <ul className="privacy-list">
              <li>Request access to your personal data</li>
              <li>Request correction of your personal data</li>
              <li>Request erasure of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Request transfer of your personal data</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
              <br />
              <a href="mailto:privacy@sydneyevents.com" className="text-primary">
                privacy@sydneyevents.com
              </a>
            </p>
          </section>

          <section className="privacy-section">
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. The updated version will be indicated by an updated
              "Last updated" date and the updated version will be effective as soon as it is accessible.
            </p>
            <p>Last updated: May 16, 2025</p>
          </section>
        </div>
      </div>
    </div>
  )
}
