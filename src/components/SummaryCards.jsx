const number = (value) =>
  typeof value === 'number' ? value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '-';

export default function SummaryCards({ summary, loading }) {
  const cards = [
    {
      title: 'Customers',
      value: number(summary?.totalCustomers),
      hint: 'Unique buyers for this tenant',
    },
    {
      title: 'Orders',
      value: number(summary?.totalOrders),
      hint: 'All orders in the DB',
    },
    {
      title: 'Revenue',
      value: summary?.totalRevenue
        ? `₹${summary.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        : '₹0',
      hint: 'Sum of order totalAmount',
    },
    {
      title: 'Avg. Order Value',
      value: summary?.avgOrderValue
        ? `₹${summary.avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        : '₹0',
      hint: 'Revenue / orders',
    },
    {
      title: 'Repeat customer rate',
      value: summary?.repeatCustomerRate
        ? `${(summary.repeatCustomerRate * 100).toFixed(1)}%`
        : '0%',
      hint: 'Customers with >1 order',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div key={card.title} className="card p-5 flex flex-col gap-2 border border-slate-800/60">
          <p className="text-xs text-amber-200 uppercase tracking-wide font-semibold">{card.title}</p>
          <p className="text-3xl font-semibold text-slate-50">{loading ? '…' : card.value}</p>
          <p className="text-xs text-slate-500">{card.hint}</p>
        </div>
      ))}
    </div>
  );
}
