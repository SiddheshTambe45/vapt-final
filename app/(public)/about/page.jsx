// "use client";

// export default function AboutPage() {
//   return (
//     <div className="p-8 max-w-5xl mx-auto space-y-6">
//       <h1 className="text-3xl font-bold text-gray-800">
//         🔐 About VAPT Automation
//       </h1>

//       <p className="text-gray-700 text-lg leading-relaxed">
//         Our platform provides an automated pipeline for{" "}
//         <strong>Vulnerability Assessment and Penetration Testing (VAPT)</strong>
//         , integrating both static and dynamic analysis to simulate real-world
//         attacks on web applications and identify potential security flaws.
//       </p>

//       <section className="space-y-3">
//         <h2 className="text-xl font-semibold text-blue-700">🚀 What It Does</h2>
//         <ul className="list-disc list-inside text-gray-700 space-y-1">
//           <li>📥 Monitors GitHub repositories for new pushes.</li>
//           <li>
//             🔍 Fetches and parses <strong>SonarCloud SAST reports</strong> for
//             vulnerabilities.
//           </li>
//           <li>
//             🛠️ Automatically deploys your app in a containerized environment.
//           </li>
//           <li>
//             🧪 Executes <strong>DAST (Dynamic Analysis)</strong> via OWASP ZAP
//             to test for runtime vulnerabilities like SQLi, XSS, etc.
//           </li>
//           <li>
//             📊 Correlates static and dynamic results for more accurate
//             reporting.
//           </li>
//           <li>📥 Provides downloadable JSON reports with detected issues.</li>
//         </ul>
//       </section>

//       <section className="space-y-3">
//         <h2 className="text-xl font-semibold text-blue-700">
//           🧠 Key Technologies
//         </h2>
//         <ul className="list-disc list-inside text-gray-700 space-y-1">
//           <li>
//             🔧 <strong>Next.js</strong> for the frontend and server routes
//           </li>
//           <li>
//             🐳 <strong>Docker</strong> for containerized deployments
//           </li>
//           <li>
//             🛰️ <strong>Koyeb</strong> or similar for cloud app hosting
//           </li>
//           <li>
//             🧪 <strong>OWASP ZAP</strong> for attack simulation and scanning
//           </li>
//           <li>
//             📊 <strong>SonarCloud</strong> for static code analysis (SAST)
//           </li>
//           <li>
//             💡 <em>Future:</em> ML + Reinforcement Learning to auto-improve
//             attack patterns
//           </li>
//         </ul>
//       </section>

//       <section className="space-y-3">
//         <h2 className="text-xl font-semibold text-blue-700">
//           🎯 Why This Matters
//         </h2>
//         <p className="text-gray-700 text-lg leading-relaxed">
//           Traditional security testing is either too manual or too shallow. Our
//           approach blends <strong>developer-friendly automation</strong> with
//           the intelligence of both static and dynamic scanning—helping teams
//           catch critical vulnerabilities before deployment, effortlessly.
//         </p>
//       </section>

//       <section className="space-y-3">
//         <h2 className="text-xl font-semibold text-blue-700">📌 Our Vision</h2>
//         <p className="text-gray-700 text-lg leading-relaxed">
//           We aim to build a self-improving VAPT pipeline that not only scans and
//           reports but <strong>learns from past vulnerabilities</strong> and
//           continuously adapts. A future where developers get real-time, accurate
//           security feedback with zero friction.
//         </p>
//       </section>
//     </div>
//   );
// }

"use client";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-gray-800">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        About Our VAPT Automation Project
      </h1>

      <section>
        <h2 className="text-2xl font-semibold mb-2">🚀 Motivation</h2>
        <p>
          This idea sparked while juggling another project. The thought of truly
          automating the vulnerability assessment and penetration testing (VAPT)
          pipeline felt exciting — one system that runs by itself without
          constant DevSecOps intervention. After all, they already carry enough
          load. Why not relieve them with real automation?
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">🧩 Problem</h2>
        <p>
          Most existing solutions are either semi-automated or require painful
          manual setups. We wanted to build something that, once started, just
          goes. No babysitting. A true plug-and-play security layer for
          developers.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">🕒 Timeline</h2>
        <ul className="space-y-4">
          <li>
            <strong>💡 Ideation:</strong> The idea struck during work on another
            project. After some research, we realized it was worth chasing.
          </li>
          <li>
            <strong>🛠️ Early Development:</strong> We spent 1–2 months building
            the initial version. Between hackathons, CTFs, bootcamps, and the
            *legendary* 75% college attendance requirement — it wasn’t easy to
            find uninterrupted time.
          </li>
          <li>
            <strong>🧪 Tooling Trials:</strong> We tried Semgrep (too costly),
            and eventually settled on SonarQube for SAST. We used Docker for
            dynamic testing, skipping cloud due to limited free tier options and
            card requirements.
          </li>
          <li>
            <strong>🌀 DAST Kicks In:</strong> Once ZAP was in place, the magic
            started. Full DAST automation from scan to feedback.
          </li>
          <li>
            <strong>🔁 Current Focus:</strong> Integrating SAST and DAST
            (SAST-guided DAST), refining OWASP ZAP attack scans, and moving
            toward ML-based automation.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">🌐 What’s Next?</h2>
        <p>
          We’re evolving this into a modular, scalable service — eventually
          pushing toward "Compliance as a Service" and using ML to improve
          detection and automate mitigation strategies. This is just the
          beginning.
        </p>
      </section>

      <p className="text-sm text-gray-500">Last updated: April 2025</p>
    </div>
  );
}
