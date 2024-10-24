In the setup, since both the frontend and API Gateway are accessible via the same domain over HTTPS, and the API Gateway communicates with the backend services using container names internally over HTTP, the app **should not** run into SSL issues. Here’s a breakdown of how this works and what should be considered:

### How Your Setup Works

1. **Frontend and API Gateway**:
   - Both the frontend and API Gateway are served under the same domain (e.g., `https://examlpedomain.com`) using reverse proxies.
   - This means that any requests made from the frontend to the API Gateway are over HTTPS.

2. **API Gateway to Backend Services**:
   - The API Gateway communicates with the backend services using their container names (e.g., `http://backend-service-1`) over the Docker network, which does not require HTTPS.
   - Since this communication is internal (between containers in the same Docker network), SSL is not necessary, and using HTTP is perfectly acceptable.

### No SSL Issues

- **Internal Communication**: Since the communication between the API Gateway and backend services happens over an internal Docker network, it doesn’t traverse the public internet. Therefore, it’s not exposed to SSL/TLS concerns.
- **Frontend to API Gateway**: The only SSL concerns will arise when the frontend communicates with the API Gateway, and since both are served over HTTPS, there should be no issues.
- **CORS Configuration**: Ensure your backend services’ CORS configuration allows the origin of your API Gateway (e.g., `https://exampledomain.com`) to avoid CORS issues.

### Security Considerations

1. **Network Security**: While internal communications can be over HTTP, consider the security of your Docker network. It's generally good practice to keep sensitive communications secure. If you're handling sensitive data, consider using HTTPS for internal services, but it may add complexity.
  
2. **Firewall Rules**: Ensure that your backend services are not exposed to the public internet unless necessary. Using a reverse proxy to limit access can help secure your setup.

3. **Environment Configuration**: If you ever move to a more complex setup or deploy to production, ensure that your configurations are set up correctly to handle both HTTPS and HTTP traffic where necessary.

### Conclusion

In summary, you should not face SSL issues given your configuration, where:
- The frontend and API Gateway are accessed via HTTPS on the same domain.
- The API Gateway communicates with backend services using container names over HTTP internally.

Just keep in mind the security implications of using HTTP internally and ensure that your CORS settings are correctly configured to allow requests from the frontend to the API Gateway. This way, your architecture will remain both functional and secure.