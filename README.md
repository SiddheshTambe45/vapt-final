# VAPT Automation Pipeline

This guide walks you through the steps to set up and run the VAPT (Vulnerability Assessment and Penetration Testing) automation pipeline for the security testing of a Next.js application. The pipeline integrates SAST (Static Application Security Testing) and DAST (Dynamic Application Security Testing), leveraging SonarQube, OWASP ZAP, and Docker for containerized execution.

## Steps to Run the Pipeline

1. Run the Next.js project locally using the following command:

   ```bash
   npm run dev

   ```

2. To expose your local development server to the internet, start an Ngrok tunnel:

   ngrok http 3000 --domain=infinite-overly-bug.ngrok-free.app

   This will provide a public URL for your locally running Next.js app.

3. Push a new change to your GitHub repository to trigger the pipeline. This could be a commit, pull request, or any change depending on your GitHub webhook configuration.

4. Upon pushing changes, the pipeline will automatically start.

5. Open PowerShell to monitor the logs. Type the following command to see the logs of the application container:

   docker logs -f vuln-tang-clan-3

6. When the Next.js app successfully runs in the container, the focus will shift to the OWASP ZAP container. A small command prompt window will open, display a SHA hash (you can safely ignore it), and then close.

7. Switch to another PowerShell tab and monitor the OWASP ZAP container logs using the following command:

   docker logs -f owasp-zap-container-1

8. Wait for OWASP ZAP to complete the scan. The pipeline will automatically generate security results based on the detected vulnerabilities.

9. Once the ZAP scan is finished, you can stop the running Docker containers using the following command:

   docker stop container_name

   Replace container_name with the actual name of the container you want to stop (e.g., vuln-tang-clan-3 or owasp-zap-container-1).
