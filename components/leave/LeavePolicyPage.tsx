import React, { useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, SaveIcon, XIcon, CalendarIcon, ClockIcon, UserIcon } from '../icons/Icons';
import { LeaveType, LeavePolicy, mockLeavePolicies } from './data';

const LeavePolicyPage: React.FC = () => {
  const [policies, setPolicies] = useState<LeavePolicy[]>(mockLeavePolicies);
  const [selectedPolicy, setSelectedPolicy] = useState<LeavePolicy>(policies[0]);
  const [isEditingPolicy, setIsEditingPolicy] = useState(false);
  const [isEditingLeaveType, setIsEditingLeaveType] = useState<string | null>(null);
  const [isAddingLeaveType, setIsAddingLeaveType] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null);

  const handleEditPolicy = () => {
    setIsEditingPolicy(true);
  };

  const handleSavePolicy = () => {
    setPolicies(prev => prev.map(p => p.id === selectedPolicy.id ? selectedPolicy : p));
    setIsEditingPolicy(false);
  };

  const handleAddLeaveType = () => {
    const newLeaveType: LeaveType = {
      id: Date.now().toString(),
      name: 'New Leave Type',
      daysAllowed: 0,
      carryForward: false,
      maxCarryForward: 0,
      description: '',
      color: '#6B7280',
      eligibleAfter: 0,
      requiresApproval: true,
      canBeHalfDay: true,
      isActive: true
    };
    setEditingLeaveType(newLeaveType);
    setIsAddingLeaveType(true);
    setIsAddModalOpen(true);
  };

  const handleSaveLeaveType = () => {
    if (!editingLeaveType) return;

    if (isAddingLeaveType) {
      setSelectedPolicy(prev => ({
        ...prev,
        leaveTypes: [...prev.leaveTypes, editingLeaveType]
      }));
    } else {
      setSelectedPolicy(prev => ({
        ...prev,
        leaveTypes: prev.leaveTypes.map(lt => lt.id === editingLeaveType.id ? editingLeaveType : lt)
      }));
    }
    
    setEditingLeaveType(null);
    setIsAddingLeaveType(false);
    setIsEditingLeaveType(null);
    setIsAddModalOpen(false);
  };

  const handleDeleteLeaveType = (id: string) => {
    if (window.confirm('Are you sure you want to delete this leave type?')) {
      setSelectedPolicy(prev => ({
        ...prev,
        leaveTypes: prev.leaveTypes.filter(lt => lt.id !== id)
      }));
    }
  };

  const handleEditLeaveType = (leaveType: LeaveType) => {
    setEditingLeaveType({ ...leaveType });
    setIsEditingLeaveType(leaveType.id);
  };

  const cancelEdit = () => {
    setEditingLeaveType(null);
    setIsAddingLeaveType(false);
    setIsEditingLeaveType(null);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Policy Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Leave Policies</h3>
          <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            <PlusIcon className="w-4 h-4 inline mr-2" />
            New Policy
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map(policy => (
            <div
              key={policy.id}
              onClick={() => setSelectedPolicy(policy)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPolicy.id === policy.id
                  ? 'border-primary bg-primary/5 dark:bg-primary/10'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{policy.name}</h4>
                {policy.isDefault && (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    Default
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{policy.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
                <span>{policy.leaveTypes.length} leave types</span>
                <span>{policy.probationPeriod} months probation</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Policy Details */}
      {selectedPolicy && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{selectedPolicy.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedPolicy.description}</p>
              </div>
              <button
                onClick={isEditingPolicy ? handleSavePolicy : handleEditPolicy}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {isEditingPolicy ? (
                  <>
                    <SaveIcon className="w-4 h-4 inline mr-2" />
                    Save Policy
                  </>
                ) : (
                  <>
                    <EditIcon className="w-4 h-4 inline mr-2" />
                    Edit Policy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Policy Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Probation Period
                </label>
                <input
                  type="number"
                  value={selectedPolicy.probationPeriod}
                  onChange={(e) => setSelectedPolicy(prev => ({ ...prev, probationPeriod: parseInt(e.target.value) }))}
                  disabled={!isEditingPolicy}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-50 dark:disabled:bg-gray-800"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Months before leave eligibility</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Working Days per Week
                </label>
                <div className="text-sm text-gray-900 dark:text-gray-100 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                  {selectedPolicy.workingDays.length} days ({selectedPolicy.workingDays.join(', ')})
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Annual Holidays
                </label>
                <div className="text-sm text-gray-900 dark:text-gray-100 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700">
                  {selectedPolicy.holidays.length} holidays defined
                </div>
              </div>
            </div>

            {/* Leave Types */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Leave Types</h4>
                <button
                  onClick={handleAddLeaveType}
                  className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 inline mr-2" />
                  Add Leave Type
                </button>
              </div>

              <div className="space-y-4">
                {selectedPolicy.leaveTypes.map(leaveType => (
                  <div key={leaveType.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    {isEditingLeaveType === leaveType.id && editingLeaveType ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Leave Type Name
                            </label>
                            <input
                              type="text"
                              value={editingLeaveType.name}
                              onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, name: e.target.value } : null)}
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Days Allowed per Year
                            </label>
                            <input
                              type="number"
                              value={editingLeaveType.daysAllowed}
                              onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, daysAllowed: parseInt(e.target.value) || 0 } : null)}
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Eligible After (months)
                            </label>
                            <input
                              type="number"
                              value={editingLeaveType.eligibleAfter}
                              onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, eligibleAfter: parseInt(e.target.value) || 0 } : null)}
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Color
                            </label>
                            <input
                              type="color"
                              value={editingLeaveType.color}
                              onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, color: e.target.value } : null)}
                              className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={editingLeaveType.description}
                            onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, description: e.target.value } : null)}
                            rows={2}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <input
                              id={`carryForward-${leaveType.id}`}
                              type="checkbox"
                              checked={editingLeaveType.carryForward}
                              onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, carryForward: e.target.checked } : null)}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor={`carryForward-${leaveType.id}`} className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                              Allow carry forward
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id={`requiresApproval-${leaveType.id}`}
                              type="checkbox"
                              checked={editingLeaveType.requiresApproval}
                              onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, requiresApproval: e.target.checked } : null)}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor={`requiresApproval-${leaveType.id}`} className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                              Requires approval
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id={`canBeHalfDay-${leaveType.id}`}
                              type="checkbox"
                              checked={editingLeaveType.canBeHalfDay}
                              onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, canBeHalfDay: e.target.checked } : null)}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor={`canBeHalfDay-${leaveType.id}`} className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                              Allow half days
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id={`isActive-${leaveType.id}`}
                              type="checkbox"
                              checked={editingLeaveType.isActive}
                              onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor={`isActive-${leaveType.id}`} className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                              Active
                            </label>
                          </div>
                        </div>

                        {editingLeaveType.carryForward && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Maximum Carry Forward Days
                            </label>
                            <input
                              type="number"
                              value={editingLeaveType.maxCarryForward}
                              onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, maxCarryForward: parseInt(e.target.value) || 0 } : null)}
                              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                          </div>
                        )}

                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveLeaveType}
                            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium transition-colors"
                          >
                            <SaveIcon className="w-4 h-4 inline mr-2" />
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: leaveType.color }}
                          ></div>
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-gray-100">{leaveType.name}</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{leaveType.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <div className="text-center">
                            <div className="font-medium text-gray-900 dark:text-gray-100">{leaveType.daysAllowed}</div>
                            <div>Days/Year</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-gray-900 dark:text-gray-100">{leaveType.eligibleAfter}</div>
                            <div>Months</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {leaveType.carryForward && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                Carry Forward
                              </span>
                            )}
                            {leaveType.requiresApproval && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                                Approval Required
                              </span>
                            )}
                            {!leaveType.isActive && (
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300">
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditLeaveType(leaveType)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <EditIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLeaveType(leaveType.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

              {/* Add New Leave Type Modal */}
              {isAddModalOpen && isAddingLeaveType && editingLeaveType && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Add Leave Type</h3>
                      <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                        <XIcon className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Leave Type Name
                          </label>
                          <input
                            type="text"
                            value={editingLeaveType.name}
                            onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, name: e.target.value } : null)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Enter leave type name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Days Allowed per Year
                          </label>
                          <input
                            type="number"
                            value={editingLeaveType.daysAllowed}
                            onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, daysAllowed: parseInt(e.target.value) || 0 } : null)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Eligible After (months)
                          </label>
                          <input
                            type="number"
                            value={editingLeaveType.eligibleAfter}
                            onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, eligibleAfter: parseInt(e.target.value) || 0 } : null)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Color
                          </label>
                          <input
                            type="color"
                            value={editingLeaveType.color}
                            onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, color: e.target.value } : null)}
                            className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editingLeaveType.description}
                          onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, description: e.target.value } : null)}
                          rows={2}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="Enter description for this leave type"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                          <input
                            id="new-carryForward"
                            type="checkbox"
                            checked={editingLeaveType.carryForward}
                            onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, carryForward: e.target.checked } : null)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="new-carryForward" className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                            Allow carry forward
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="new-requiresApproval"
                            type="checkbox"
                            checked={editingLeaveType.requiresApproval}
                            onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, requiresApproval: e.target.checked } : null)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="new-requiresApproval" className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                            Requires approval
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="new-canBeHalfDay"
                            type="checkbox"
                            checked={editingLeaveType.canBeHalfDay}
                            onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, canBeHalfDay: e.target.checked } : null)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="new-canBeHalfDay" className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                            Allow half days
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="new-isActive"
                            type="checkbox"
                            checked={editingLeaveType.isActive}
                            onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="new-isActive" className="ml-2 text-sm text-gray-900 dark:text-gray-100">
                            Active
                          </label>
                        </div>
                      </div>

                      {editingLeaveType.carryForward && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Maximum Carry Forward Days
                          </label>
                          <input
                            type="number"
                            value={editingLeaveType.maxCarryForward}
                            onChange={(e) => setEditingLeaveType(prev => prev ? { ...prev, maxCarryForward: parseInt(e.target.value) || 0 } : null)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </div>
                      )}

                    <div className="flex justify-end space-x-3 p-6 pt-0">
                      <button onClick={cancelEdit} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md text-sm font-medium transition-colors">
                        <XIcon className="w-4 h-4 inline mr-2" />
                        Cancel
                      </button>
                      <button onClick={handleSaveLeaveType} className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md text-sm font-medium transition-colors">
                        <SaveIcon className="w-4 h-4 inline mr-2" />
                        Add Leave Type
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeavePolicyPage;