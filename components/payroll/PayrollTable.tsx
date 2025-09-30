
import React from 'react';
import { PayrollRecord, Employee } from '../../types';
import { ReportIcon } from '../icons/Icons';

interface Props {
  records: PayrollRecord[];
  employees: Employee[];
  onViewSlip: (recordId: string) => void;
}

const statusStyles = {
    Paid: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
};

const PayrollTable: React.FC<Props> = ({ records, employees, onViewSlip }) => {
  const employeeMap = new Map<number, Employee>(employees.map(e => [e.id, e] as [number, Employee]));

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Employee</th>
                        <th scope="col" className="px-6 py-3">Department</th>
                        <th scope="col" className="px-6 py-3">Basic Salary</th>
                        <th scope="col" className="px-6 py-3">Deductions</th>
                        <th scope="col" className="px-6 py-3">Net Salary</th>
                        <th scope="col" className="px-6 py-3 text-center">Status</th>
                        <th scope="col" className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((record) => {
                        const employee = employeeMap.get(record.employeeId);
                        if (!employee) return null;
                        
                        const formatCurrency = (val: number) => `$${val.toLocaleString()}`;
                        
                        return (
                            <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img src={employee.avatar} alt={employee.name} className="w-8 h-8 rounded-full" />
                                        <div>{employee.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{employee.department}</td>
                                <td className="px-6 py-4">{formatCurrency(record.basicSalary)}</td>
                                <td className="px-6 py-4 text-red-600">{formatCurrency(record.deductions)}</td>
                                <td className="px-6 py-4 font-bold text-primary">{formatCurrency(record.netSalary)}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[record.status]}`}>
                                        {record.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => onViewSlip(record.id)} className="font-medium text-primary hover:underline flex items-center justify-center gap-1 mx-auto">
                                       <ReportIcon className="w-4 h-4"/> View Slip
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
             {records.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-text-primary">No Payroll Data</h3>
                    <p className="text-text-secondary mt-1">No records found for the selected month.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default PayrollTable;
