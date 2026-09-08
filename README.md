# 🏢 KeyNest Realty Property Management

Official web application and digital platform for **KeyNest Realty Property Management**, operating under the brokerage of **Fair Deal Realty Inc.** (TREC Licensed Texas Real Estate Brokerage).

Serving single-family, condo, and multi-family residential rental owners and residents across North Texas.

---

## 📍 Brokerage & Governance
- **Operating Entity:** KeyNest Realty Property Management
- **Sponsoring Brokerage:** Fair Deal Realty Inc. (Texas Real Estate Commission Licensed)
- **Supervising Broker:** Purvang Patel (Broker License #0588636)
- **Corporate Office:** 4815 State Hwy 121, Suite 2, The Colony, TX 75056
- **Direct Phone:** (469) 215-1440
- **Email:** info@keynestrealty.com

---

## 🌟 Core Platform Features

- 🏡 **Full Management Lifecycle**: Transparent 7-stage property management workflow (Onboarding, Marketing, Tenant Screening, Leasing, Rent Collection, Maintenance, Accounting).
- 💰 **Published Fee Schedule & Interactive Calculator**: Transparent pricing tiers (8% Full-Service, 10% Premium) with real-time monthly and annual net return estimations.
- 📱 **AppFolio Client Portals**: Dedicated integration gateways for property owners (financials, monthly ACH distribution ledgers, 1099s) and residents (autopay, maintenance ticketing).
- 🛠️ **24/7 Maintenance & Repair Triage**: Interactive step-by-step triage wizard for tenants with 3-tier severity classification (Emergency, Urgent, Routine) and zero fee markups for owners.
- 🗺️ **North Texas Service Territory Spotlight**: Tailored local market guides for 7 core North Texas cities: Frisco, Plano, McKinney, Prosper, The Colony, Little Elm, and Carrollton.
- 📜 **Statutory Texas Compliance**: Integrated TREC Information About Brokerage Services (IABS), Consumer Protection Notice, and Equal Housing Opportunity disclosures.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native for Web) + [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Language**: TypeScript
- **Styling**: Responsive Design System (Warm Beige `#FDFBF7`, Deep Charcoal `#22252A`, Soft Sage Green `#367A5E`)
- **Icons**: Lucide Icons (`lucide-react-native`)
- **Hosting & CI/CD**: Netlify (Automated Git deployments)

---

## 🚀 Development & Deployment

### Local Development
```bash
# Navigate to expo directory
cd expo

# Install dependencies
bun install

# Start local dev server
bun run web
```

### Production Build
```bash
# Export static web bundle
npx expo export -p web
```

Netlify automatically builds and deploys upon commits to the `main` branch via `netlify.toml`.

---

## 🔒 License & Copyright

© 2026 KeyNest Realty. All rights reserved. KeyNest Realty Property Management operates under the active brokerage of Fair Deal Realty Inc., a Texas licensed real estate brokerage. Equal Housing Opportunity.
