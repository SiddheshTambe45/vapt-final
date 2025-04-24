// components/Flowchart.tsx
"use client";

export default function Flowchart() {
  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-8">Program Flowchart</h1>

      <div className="flex flex-col items-center space-y-12">
        {/* Step 1 */}
        <div className="flex flex-col items-center">
          <div className="w-64 p-4 text-center bg-blue-500 text-white rounded-xl shadow-md">
            New code is pushed to GitHub repo
          </div>
          <div className="h-16 flex justify-center items-center">
            <span className="text-4xl text-gray-600">↓</span>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center">
          <div className="w-64 p-4 text-center bg-green-500 text-white rounded-xl shadow-md">
            GitHub Webhook Event Triggered
          </div>
          <div className="h-16 flex justify-center items-center">
            <span className="text-4xl text-gray-600">↓</span>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center">
          <div className="w-64 p-4 text-center bg-yellow-500 text-white rounded-xl shadow-md">
            Security Pipeline Starts
          </div>
          <div className="h-16 flex justify-center items-center">
            <span className="text-4xl text-gray-600">↓</span>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col items-center">
          <div className="w-64 p-4 text-center bg-purple-500 text-white rounded-xl shadow-md">
            Fetch SAST Report from SonarQube
          </div>
          <div className="h-16 flex justify-center items-center">
            <span className="text-4xl text-gray-600">↓</span>
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex flex-col items-center">
          <div className="w-64 p-4 text-center bg-indigo-500 text-white rounded-xl shadow-md">
            Fetch code from GitHub repo
          </div>
          <div className="h-16 flex justify-center items-center">
            <span className="text-4xl text-gray-600">↓</span>
          </div>
        </div>

        {/* Step 6 */}
        <div className="flex flex-col items-center">
          <div className="w-64 p-4 text-center bg-red-500 text-white rounded-xl shadow-md">
            Run code in Docker container
          </div>
          <div className="h-16 flex justify-center items-center">
            <span className="text-4xl text-gray-600">↓</span>
          </div>
        </div>

        {/* Step 7 */}
        <div className="flex flex-col items-center">
          <div className="w-64 p-4 text-center bg-teal-500 text-white rounded-xl shadow-md">
            Start OWASP ZAP Container
          </div>
          <div className="h-16 flex justify-center items-center">
            <span className="text-4xl text-gray-600">↓</span>
          </div>
        </div>

        {/* Step 8 */}
        <div className="flex flex-col items-center">
          <div className="w-64 p-4 text-center bg-orange-500 text-white rounded-xl shadow-md">
            Run AJAX Spider Scan
          </div>
          <div className="h-16 flex justify-center items-center">
            <span className="text-4xl text-gray-600">↓</span>
          </div>
        </div>

        {/* Step 9 */}
        <div className="flex flex-col items-center">
          <div className="w-64 p-4 text-center bg-pink-500 text-white rounded-xl shadow-md">
            Run Active Scan
          </div>
          <div className="h-16 flex justify-center items-center">
            <span className="text-4xl text-gray-600">↓</span>
          </div>
        </div>

        {/* Step 10 */}
        <div className="flex flex-col items-center">
          <div className="w-64 p-4 text-center bg-gray-500 text-white rounded-xl shadow-md">
            Store Results Locally
          </div>
          <div className="h-16 flex justify-center items-center">
            <span className="text-4xl text-gray-600">↓</span>
          </div>
        </div>

        {/* End */}
        <div className="flex flex-col items-center">
          <div className="w-64 p-4 text-center bg-green-600 text-white rounded-xl shadow-md">
            End
          </div>
        </div>
      </div>
    </div>
  );
}
