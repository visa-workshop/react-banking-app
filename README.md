# React Banking App Template

Are you ready to revolutionize the world of online banking? This template is designed to help you create a modern, user-friendly, and visually stunning banking application using React. With its sleek design and cutting-edge technology, this template is the perfect starting point for your next project.

**Key Features**

- **Responsive Design**: A mobile-first approach ensures a seamless user experience across all devices.
- **Modern UI**: A clean, intuitive interface that makes banking easy and enjoyable.
- **Customizable**: Tailor the template to fit your brand's unique style and needs.
- **Easy Integration**: Integrate with your existing banking systems or third-party services with ease.

**Get Started**

Whether you're a seasoned developer or just starting out, this template provides a solid foundation for your project. Follow the simple installation steps to get up and running quickly.

## Support this project

You are free to download, change and use it anywhere. I will regularly update this template with new resources and pages I found on the web. Don't hesitate to participate by sending a PR! Maybe your first on Github :)

If you like this resource, please follow me on GitHub. Thank you!

## Demo

[https://sentry-integration-app-3m9l8hgb.devinapps.com](https://sentry-integration-app-3m9l8hgb.devinapps.com)

## Screenshots

![Signin](https://raw.githubusercontent.com/cenksari/react-banking-app-template/master/screenshots/signin.png)

![Home](https://raw.githubusercontent.com/cenksari/react-banking-app-template/master/screenshots/home.png)

![Transactions](https://raw.githubusercontent.com/cenksari/react-banking-app-template/master/screenshots/transactions.png)

![Cards](https://raw.githubusercontent.com/cenksari/react-banking-app-template/master/screenshots/cards.png)

![Add](https://raw.githubusercontent.com/cenksari/react-banking-app-template/master/screenshots/addmoney.png)

![Profile](https://raw.githubusercontent.com/cenksari/react-banking-app-template/master/screenshots/profile.png)

![Savings](https://raw.githubusercontent.com/cenksari/react-banking-app-template/master/screenshots/savings.png)

## Installation

1. Clone the project:

   ```bash
   git clone https://github.com/cenksari/react-banking-app-template.git
   ```

2. Navigate to the project directory:

   ```bash
   cd react-banking-app-template
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

4. Start the application:

   ```bash
   npm start
   ```

## Usage

Once the application is started, navigate to [http://localhost:3000](http://localhost:3000) in your browser to test application.

## Error Tracking with Sentry

This application includes [Sentry](https://sentry.io) for error monitoring, performance tracing, and session replay.

**Features:**
- Automatic error capture and reporting
- Browser performance tracing
- Session replay for debugging user issues
- ErrorBoundary component wrapping the app to catch React errors

**Configuration:**

The Sentry DSN is configured in `src/sentry.ts`. If you fork this repository, replace the DSN with your own from your Sentry project settings.

**Sample Rates (configurable in `src/sentry.ts`):**
- `tracesSampleRate: 1.0` - Captures 100% of transactions for performance monitoring (reduce in production to manage costs)
- `replaysSessionSampleRate: 0.1` - Captures 10% of all sessions for replay
- `replaysOnErrorSampleRate: 1.0` - Captures 100% of sessions with errors for replay

**Sentry → Devin Alert Pipeline:**

The Send Money page intentionally triggers a simulated payment gateway error on form submission. This error is captured by Sentry with a `feature: send_money` tag, which triggers an alert rule that sends a webhook to a middleware service (`https://app-ixyrbrvl.fly.dev/webhook/sentry`). The webhook service then creates a Devin session to automatically investigate and triage the issue.

See `.agents/skills/sentry-devin-alerts.md` for instructions on adding or modifying alerts.

## Deployment

The app is deployed at [https://sentry-integration-app-3m9l8hgb.devinapps.com](https://sentry-integration-app-3m9l8hgb.devinapps.com).

To deploy a new version:

1. Build the production bundle:

   ```bash
   yarn build
   ```

2. Ask Devin to deploy the app:

   > Deploy the React banking app. The build folder is at `build/`.

   Devin will use `deploy frontend` with the `build/` directory to push the new version to the same URL.

Alternatively, you can deploy to any static hosting provider (Vercel, Netlify, S3+CloudFront, etc.) by uploading the contents of the `build/` folder. The Sentry integration works regardless of where the app is hosted — errors will be reported with `environment: production` automatically.

## Contributing

If you would like to contribute, please create a new branch and submit a pull request with your changes. Review may be needed before acceptance.

## Authors

@cenksari

## License

MIT
