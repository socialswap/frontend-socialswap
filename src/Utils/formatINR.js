// "₹3,999" / "₹1,50,000". Prices arrive as numbers or free-form strings ("3999", "₹ 3,999").
const formatINR = (value) => {
  if (value === null || value === undefined || value === '') return '₹0';
  const amount = Number(String(value).replace(/[^\d.]/g, ''));
  if (!Number.isFinite(amount)) return `₹${value}`;
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
};

export default formatINR;
