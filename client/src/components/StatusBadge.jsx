import React from 'react';
import { Clock, CheckCircle2, CheckCheck, XCircle, ShieldCheck, ShieldAlert } from 'lucide-react';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  switch (normalized) {
    case 'pending':
      return (
        <span className="badge badge-pending">
          <Clock size={13} /> Pending
        </span>
      );
    case 'confirmed':
      return (
        <span className="badge badge-confirmed">
          <CheckCircle2 size={13} /> Confirmed
        </span>
      );
    case 'completed':
      return (
        <span className="badge badge-completed">
          <CheckCheck size={13} /> Completed
        </span>
      );
    case 'cancelled':
      return (
        <span className="badge badge-cancelled">
          <XCircle size={13} /> Cancelled
        </span>
      );
    case 'active':
      return (
        <span className="badge badge-active">
          <ShieldCheck size={13} /> Active
        </span>
      );
    case 'inactive':
      return (
        <span className="badge badge-inactive">
          <ShieldAlert size={13} /> Inactive
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};

export default StatusBadge;
