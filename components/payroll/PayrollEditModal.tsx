import React, { useEffect, useMemo, useState } from 'react';
import { Employee, PayrollRecord } from '../../types';
import { XIcon, SaveIcon } from '../icons/Icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: PayrollRecord) => void;
  employees: Employee[];
  initialRecord?: PayrollRecord | null;
}

const emptyRecord = (employeeId?: number, month?: string): PayrollRecord => ({
  id: `payroll-new-${Date.now()}`,
  employeeId: employeeId ?? 0,
  month: month ?? new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
  basicSalary: 0,
  allowances: 0,
  deductions: 0,
  netSalary: 0,
  status: 'Pending',
});

const PayrollEditModal: React.FC<Props> = ({ isOpen, onClose, onSave, employees, initialRecord }) => {
  const [record, setRecord] = useState<PayrollRecord>(initialRecord ?? emptyRecord());
  const [basicInput, setBasicInput] = useState<string>('');
  const [allowancesInput, setAllowancesInput] = useState<string>('');
  const [deductionsInput, setDeductionsInput] = useState<string>('');
  const [monthInput, setMonthInput] = useState<string>(''); // YYYY-MM

  const labelFromYm = (ym: string) => {
    // ym format YYYY-MM
    try {
      const [y, m] = ym.split('-').map(n => parseInt(n, 10));
      if (!y || !m) return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
      // Construct date as UTC to avoid TZ shifts
      const dt = new Date(Date.UTC(y, m - 1, 1));
      return dt.toLocaleString('default', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    } catch {
      return new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    }
  };

  const ymFromLabel = (label: string) => {
    // attempt to parse 'September 2025' into YYYY-MM
    try {
      const dt = new Date(label);
      if (isNaN(dt.getTime())) {
        return '';
      }
      const y = dt.getUTCFullYear();
      const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
      return `${y}-${m}`;
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const init = initialRecord ?? emptyRecord();
    setRecord(init);
    setBasicInput(init.basicSalary ? String(init.basicSalary) : '');
    setAllowancesInput(init.allowances ? String(init.allowances) : '');
    setDeductionsInput(init.deductions ? String(init.deductions) : '');
    const initYm = ymFromLabel(init.month) || new Date().toISOString().slice(0,7);
    setMonthInput(initYm);
  }, [initialRecord, isOpen]);

  const employeeMap = useMemo(() => new Map(employees.map(e => [e.id, e])), [employees]);

  const recomputeNet = (basic: number, allowances: number, deductions: number) => {
    return Math.max(0, basic + allowances - deductions);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-text-primary dark:text-gray-100">{initialRecord ? 'Edit Payroll' : 'Add Payroll'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <XIcon className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Employee</label>
              <select
                value={record.employeeId || ''}
                onChange={(e) => setRecord(prev => ({ ...prev, employeeId: parseInt(e.target.value, 10) || 0 }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select employee...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} • {emp.department}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Month</label>
              <input
                type="month"
                value={monthInput}
                onChange={(e) => {
                  const ym = e.target.value; // YYYY-MM
                  setMonthInput(ym);
                  setRecord(prev => ({ ...prev, month: labelFromYm(ym) }));
                }}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Basic Salary</label>
              <input
                type="number"
                value={basicInput}
                placeholder="0"
                onChange={(e) => {
                  const val = e.target.value;
                  setBasicInput(val);
                  const basic = val === '' ? 0 : parseFloat(val) || 0;
                  setRecord(prev => ({ ...prev, basicSalary: basic, netSalary: recomputeNet(basic, prev.allowances, prev.deductions) }));
                }}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Allowances</label>
              <input
                type="number"
                value={allowancesInput}
                placeholder="0"
                onChange={(e) => {
                  const val = e.target.value;
                  setAllowancesInput(val);
                  const allowances = val === '' ? 0 : parseFloat(val) || 0;
                  setRecord(prev => ({ ...prev, allowances, netSalary: recomputeNet(prev.basicSalary, allowances, prev.deductions) }));
                }}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Deductions</label>
              <input
                type="number"
                value={deductionsInput}
                placeholder="0"
                onChange={(e) => {
                  const val = e.target.value;
                  setDeductionsInput(val);
                  const deductions = val === '' ? 0 : parseFloat(val) || 0;
                  setRecord(prev => ({ ...prev, deductions, netSalary: recomputeNet(prev.basicSalary, prev.allowances, deductions) }));
                }}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Status</label>
              <select
                value={record.status}
                onChange={(e) => setRecord(prev => ({ ...prev, status: e.target.value as PayrollRecord['status'] }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-gray-300 mb-1">Net Salary</label>
              <input
                type="number"
                value={record.netSalary}
                readOnly
                className="w-full border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md text-sm font-medium transition-colors">Cancel</button>
            <button
              onClick={() => {
                if (!record.employeeId || !employeeMap.get(record.employeeId)) return;
                const id = initialRecord ? initialRecord.id : `payroll-${record.employeeId}-${record.month.replace(' ', '-')}`;
                onSave({ ...record, id });
                onClose();
              }}
              disabled={!record.employeeId || !monthInput}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollEditModal;


