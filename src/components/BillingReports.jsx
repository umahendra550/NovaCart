import React, { useEffect, useState } from 'react';
import { fetchBillingReports } from '../services/api';
import { DollarSign, ShoppingBag, TrendingUp, Layers, RefreshCw, Award, Database } from 'lucide-react';

export default function BillingReports() {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchBillingReports();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  if (isLoading) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
        <RefreshCw size={32} className="spin" style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h3>Executing Aggregate SQL Billing Queries...</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Querying MySQL database tables (Orders, Categories, Products, Order_Items) using SUM, COUNT, and GROUP BY.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', borderColor: 'var(--danger)' }}>
        <h3 style={{ color: 'var(--danger)' }}>Failed to Load Billing Reports</h3>
        <p style={{ margin: '0.5rem 0 1rem 0' }}>{error}</p>
        <button className="checkout-btn" onClick={loadReports} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
          Retry Query
        </button>
      </div>
    );
  }

  const { summary = {}, categoryBreakdown = [], topProducts = [] } = reportData || {};

  return (
    <div className="reports-container">
      {/* Top Banner explaining Database Aggregate Queries */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Database size={20} color="#6366f1" />
              <h2 style={{ fontSize: '1.35rem' }}>Database Billing & Revenue Analytics</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Real-time executive metrics computed via MySQL aggregate queries (<code>SUM</code>, <code>COUNT</code>, <code>AVG</code>, <code>GROUP BY</code>) across Categories, Products, and Order_Items.
            </p>
          </div>
          <button className="nav-tab-btn" onClick={loadReports} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <RefreshCw size={14} />
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card glass-panel">
          <div className="metric-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="metric-value gradient-text">
              ${Number(summary.total_net_revenue || 0).toFixed(2)}
            </div>
            <div className="metric-label">Total Gross Sales Revenue (SUM)</div>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-icon-wrap" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div className="metric-value">
              {summary.total_orders_placed || 0}
            </div>
            <div className="metric-label">Completed Orders (COUNT)</div>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="metric-value">
              ${Number(summary.average_order_value || 0).toFixed(2)}
            </div>
            <div className="metric-label">Average Order Value (AVG)</div>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Layers size={24} />
          </div>
          <div>
            <div className="metric-value">
              ${Number(summary.total_tax_collected || 0).toFixed(2)}
            </div>
            <div className="metric-label">Sales Tax Collected (SUM)</div>
          </div>
        </div>
      </div>

      {/* Category Sales Breakdown Table (GROUP BY category_id) */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} color="#6366f1" />
          <span>Category Performance Breakdown (GROUP BY Category)</span>
        </h3>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Total Orders</th>
                <th>Units Sold (SUM)</th>
                <th>Avg Unit Price</th>
                <th style={{ textAlign: 'right' }}>Gross Revenue (SUM)</th>
              </tr>
            </thead>
            <tbody>
              {categoryBreakdown.map((cat) => (
                <tr key={cat.category_id}>
                  <td style={{ fontWeight: '600' }}>{cat.category_name}</td>
                  <td>{cat.total_orders} orders</td>
                  <td>{cat.total_units_sold} pcs</td>
                  <td>${Number(cat.average_unit_price).toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                    ${Number(cat.gross_category_revenue).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performing Products Table */}
      <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-lg)' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={18} color="#f59e0b" />
          <span>Top Performing Products Billing Report</span>
        </h3>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product Title</th>
                <th>Category</th>
                <th>Qty Sold</th>
                <th style={{ textAlign: 'right' }}>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((prod, idx) => (
                <tr key={prod.product_id}>
                  <td>
                    <span style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: idx === 0 ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                      color: idx === 0 ? '#000' : 'inherit',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: '700'
                    }}>
                      #{idx + 1}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600' }}>{prod.product_name}</td>
                  <td><span className="category-count">{prod.category_name}</span></td>
                  <td>{prod.total_quantity_sold} units</td>
                  <td style={{ textAlign: 'right', fontWeight: '700', color: 'var(--success)' }}>
                    ${Number(prod.total_revenue_generated).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
