# SegmentPulse — Modern Customer Segmentation Analytics Platform

A production-grade, responsive administrative and analytical dashboard built with **React**, **TypeScript**, **Tailwind CSS**, **Recharts**, and **Axios**.

SegmentPulse enables data teams, marketing strategists, and business leaders to upload customer datasets, enter individual records, configure and trigger unsupervised segmentation (K-Means, RFM, Hierarchical), visualize multidimensional cluster centroids, explore customer cohorts, and export analytical reports.

---

## 🌟 Key Features & Workflow

The platform follows a clear segmentation pipeline:

```
Upload Dataset  ──►  Preview & Validate  ──►  Configure Parameters  ──►  Segment Customers  ──►  Explore Clusters & Cohorts
```

1. **Analytical Overview Dashboard (`/`)**:
   - Executive metric cards: Total Customers, Segments Identified, Avg Customer Value, Last Segmentation, Dataset Size, and Status.
   - Interactive Customer Distribution bar chart (Recharts) with hover counts, percentage shares, and direct cluster navigation.
   - Segment Overview cards highlighting key volume, spend, and frequency metrics for each cluster.
   - Real-time recent activity audit timeline.

2. **Customer Data Management (`/customers`)**:
   - Single customer entry form with strict demographic and numeric range validations.
   - **Bulk Entry Modal**: Direct CSV text pasting, automated validation engine (valid records, invalid records, duplicate ID detection), and downloadable error reports.
   - Paginated, sortable customer data table with sticky headers and quick deletion.

3. **CSV Dataset Ingestion (`/upload`)**:
   - Drag-and-drop file upload with format validation, size checks, and instant sample CSV template generator.
   - Active dataset diagnostics: row count, column count, missing value percentage, duplicate count, and health status badge.
   - Dynamic table previewing the first 15 records with column auto-discovery.

4. **Segmentation Runner (`/segmentation`)**:
   - Hyperparameter configuration: cluster count slider ($K \in [2, 8]$), algorithm selector, and multi-attribute feature selection checkboxes (Age, Annual Income, Spending Score, Frequency, Order Value, Recency, Tenure).
   - Asynchronous 5-step progress workflow (Validation ➔ Attribute Scaling ➔ Cluster Partitioning ➔ Centroid Calculation ➔ Result Finalization) with cancel support.
   - **Results view**: Summary cards, interactive Bar/Donut distribution toggle, and sortable cluster comparison matrix.

5. **Customer Explorer (`/explorer`)**:
   - Multi-variable filtering: Search by ID, cluster selector, age range, income bracket, spending score, and purchase frequency.
   - Paginated customer table with cluster color badges.
   - **Customer Details Drawer**: Slide-over panel featuring normalized 5-dimensional Radar Chart (Customer vs. Cluster Average) and behavioral scorecards.

6. **Cluster Deep-Dive (`/clusters`)**:
   - Tabbed cluster switcher across all identified cohorts.
   - Visual distribution histograms: Income distribution, Spending score distribution, and Age demographic breakdown.
   - Centroid attribute vector radar chart comparing the cluster profile to population averages.
   - Filtered customer table for the active cluster with one-click "Export Cohort CSV".

7. **Reports & Historical Intelligence (`/reports`)**:
   - Segmentation audit history table with run date, customer volume, cluster count, and silhouette quality score.
   - Longitudinal cohort share line charts tracking customer migration across months.
   - One-click CSV and JSON report exports.

8. **Settings & Backend API Manager (`/settings`)**:
   - Live backend API endpoint configuration (`VITE_API_BASE_URL`).
   - Mock Mode toggle switch: seamlessly transition between realistic in-memory mock services and a live REST backend.
   - "Test Connection" latency probe with status feedback.
   - Localization preferences (Currency symbol: ₹, $, €, £).

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Light theme `#F7F8FA` background, `#2563EB` primary, Inter typography)
- **Routing**: React Router DOM (v7)
- **Charts**: Recharts (Responsive Bar, Donut/Pie, Line, Radar, and Histograms)
- **HTTP Client**: Axios with centralized instance and request/response interceptors
- **Icons**: Lucide React
- **State Architecture**: React Context (`AppContext`, `ToastContext`)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher

### Installation

1. Navigate to the project root directory:
   ```bash
   cd customer-segmentation-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:5173
   ```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔌 Connecting to a Backend (e.g. Spring Boot / FastAPI)

The API layer is completely modularized inside `src/api/`. UI components never call raw endpoints directly.

### Standard Expected Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Backend connection health check |
| `GET` | `/customers` | Paginated customer list with filter query params |
| `POST` | `/customers` | Create a single customer record |
| `POST` | `/customers/bulk` | Bulk import an array of customer records |
| `GET` | `/customers/{id}` | Get specific customer by ID |
| `DELETE` | `/customers/{id}` | Delete customer record |
| `GET` | `/datasets` | Retrieve available datasets |
| `POST` | `/datasets/upload` | Multipart form-data CSV upload |
| `POST` | `/segmentation/run` | Execute clustering with hyperparameter config |
| `GET` | `/segmentation/latest/results` | Fetch latest segmentation result |
| `GET` | `/clusters` | Get all cluster summaries |
| `GET` | `/reports` | Retrieve historical segmentation reports |

### Switching from Mock Mode to Live Backend

1. In the application, navigate to **Settings** (`/settings`).
2. Toggle **API Service Mock Mode** to **OFF**.
3. Input your backend URL (e.g. `http://localhost:8080/api`).
4. Click **Test Connection** to verify endpoint availability, then click **Save URL**.
