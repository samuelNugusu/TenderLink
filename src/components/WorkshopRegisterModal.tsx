import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Workshop } from '../types';
import {
  X,
  Building2,
  CheckCircle,
  Wrench,
  Users,
  Award,
  ArrowRight,
  ArrowLeft,
  Save,
} from 'lucide-react';

interface WorkshopRegisterModalProps {
  onClose: () => void;
  onRegistered?: (workshop: Workshop) => void;
}

export const WorkshopRegisterModal: React.FC<WorkshopRegisterModalProps> = ({
  onClose,
  onRegistered,
}) => {
  const { registerWorkshop } = useApp();
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('+251 9');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Addis Ababa');
  const [area, setArea] = useState('Industrial Zone');
  const [address, setAddress] = useState('');

  // Step 2
  const [workshopType, setWorkshopType] = useState('Solid Wood & Steel Hybrid');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([
    'School Desks',
    'Office Desks',
  ]);
  const [selectedMachinery, setSelectedMachinery] = useState<string[]>([
    'Table Saw',
    'Thickness Planer',
    'Arc Welding Unit',
  ]);
  const [monthlyCapacityUnits, setMonthlyCapacityUnits] = useState(120);
  const [workerCount, setWorkerCount] = useState(12);

  // Step 3
  const [yearsOfExperience, setYearsOfExperience] = useState(8);
  const [pastProjectsSummary, setPastProjectsSummary] = useState('');
  const [preferredContractSize, setPreferredContractSize] = useState('1,500,000 - 5,000,000 ETB');
  const [availabilityStatus, setAvailabilityStatus] = useState<
    'available' | 'partially_available' | 'busy'
  >('available');

  const specialtyOptions = [
    'School Desks',
    'Office Desks',
    'Modular Partitioning',
    'Ergonomic Swivel Chairs',
    'Filing & Storage Cabinets',
    'Medical Examination Couches',
    'Dormitory Bunk Beds',
    'Conference Tables',
  ];

  const machineryOptions = [
    'Table Saw',
    'Thickness Planer',
    'Surface Jointer',
    'Arc Welding Unit',
    'MIG Welding Machine',
    'CNC Edge Bander',
    'Multi-Spindle Boring Machine',
    'Spray Painting Booth',
    'Pipe Bending Machine',
    'Industrial Sewing Machine',
  ];

  const toggleSpecialty = (item: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(item) ? prev.filter(s => s !== item) : [...prev, item]
    );
  };

  const toggleMachinery = (item: string) => {
    setSelectedMachinery(prev =>
      prev.includes(item) ? prev.filter(m => m !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await registerWorkshop({
        businessName,
        ownerName,
        phone,
        email,
        city,
        area,
        address,
        workshopType,
        specialties: selectedSpecialties,
        machinery: selectedMachinery,
        monthlyCapacityUnits,
        workerCount,
        yearsOfExperience,
        pastProjectsSummary:
          pastProjectsSummary ||
          `Experienced furniture manufacturing cluster in ${area}, specializing in institutional orders.`,
        preferredContractSize,
        availabilityStatus,
      });

      setIsDone(true);
      setTimeout(() => {
        if (onRegistered) onRegistered(created);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-base font-bold text-white">Workshop Registration</h2>
              <span className="text-xs text-slate-400">
                Step {step} of 3: {step === 1 ? 'Business & Location' : step === 2 ? 'Capacity & Machinery' : 'Experience & Review'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress dots */}
        <div className="flex border-b border-slate-200 text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex-1 py-2 text-center border-b-2 cursor-pointer ${step === 1 ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent hover:bg-slate-50'}`}
          >
            1. Business Details
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex-1 py-2 text-center border-b-2 cursor-pointer ${step === 2 ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent hover:bg-slate-50'}`}
          >
            2. Production Capacity
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`flex-1 py-2 text-center border-b-2 cursor-pointer ${step === 3 ? 'border-teal-600 text-teal-700 bg-teal-50/50' : 'border-transparent hover:bg-slate-50'}`}
          >
            3. Verification & Submit
          </button>
        </div>

        {/* Step Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs text-slate-800">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Workshop / Enterprise Legal Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ethio-Craft Precision Wood & Metal Fabricators Enterprise"
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Owner / Authorized Representative *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tadesse Haile"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Phone Number (Ethiopia) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+251 911 ..."
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    City / Regional State Center *
                  </label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                  >
                    <option value="Addis Ababa">Addis Ababa City Admin</option>
                    <option value="Hawassa">Hawassa (Sidama)</option>
                    <option value="Adama">Adama (Oromia)</option>
                    <option value="Bahir Dar">Bahir Dar (Amhara)</option>
                    <option value="Dire Dawa">Dire Dawa Chartered City</option>
                    <option value="Mekelle">Mekelle (Tigray)</option>
                    <option value="Jimma">Jimma (Oromia)</option>
                    <option value="Gondar">Gondar (Amhara)</option>
                    <option value="Bishoftu">Bishoftu (Oromia)</option>
                    <option value="Jigjiga">Jigjiga (Somali)</option>
                    <option value="Harar">Harar (Harari)</option>
                    <option value="Other Regional Center">Other Regional Center / Town</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Industrial Zone / Area Sub-City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Industrial Park, Manufacturing Zone, Sub-City"
                    value={area}
                    onChange={e => setArea(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Specific Physical Address / Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Woreda 03, behind Timber Depot, Masalemiya"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!businessName || !ownerName || !phone}
                  className="px-4 py-2 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Continue to Capacity</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Primary Workshop Fabrication Type
                </label>
                <select
                  value={workshopType}
                  onChange={e => setWorkshopType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                >
                  <option value="Solid Wood & Steel Hybrid">Solid Wood & Steel Hybrid (Desks, Beds, Benches)</option>
                  <option value="Panel & Engineered Wood">Panel & Engineered Wood (Cabinetry, Office Modular)</option>
                  <option value="Metal Fabrication & Welding">Metal Fabrication & Welding (Frames, Racks, Couches)</option>
                  <option value="Upholstery & Soft Seating">Upholstery & Soft Seating (Office Chairs, Auditorium)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Product Specialties (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {specialtyOptions.map(spec => (
                    <label
                      key={spec}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${selectedSpecialties.includes(spec) ? 'border-teal-500 bg-teal-50/60 font-medium text-teal-900' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSpecialties.includes(spec)}
                        onChange={() => toggleSpecialty(spec)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Available Machinery & Tooling (For Capacity Verification)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {machineryOptions.map(mach => (
                    <label
                      key={mach}
                      className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${selectedMachinery.includes(mach) ? 'border-teal-500 bg-teal-50/60 font-medium text-teal-900' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMachinery.includes(mach)}
                        onChange={() => toggleMachinery(mach)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>{mach}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Approx. Monthly Capacity (Units)
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={monthlyCapacityUnits}
                    onChange={e => setMonthlyCapacityUnits(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">e.g. Desks, tables, or cabinets per month</span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Active Workforce Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={workerCount}
                    onChange={e => setWorkerCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Full-time carpenters, welders, finishers</span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-medium hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <span>Review & Finish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Years of Operational Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={yearsOfExperience}
                    onChange={e => setYearsOfExperience(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Availability for New Contracts
                  </label>
                  <select
                    value={availabilityStatus}
                    onChange={e => setAvailabilityStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                  >
                    <option value="available">Available (Immediate capacity ready)</option>
                    <option value="partially_available">Partially Available (Limited slots)</option>
                    <option value="busy">Busy (Full queue currently)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Summary of Past Relevant Projects / Clients
                </label>
                <textarea
                  rows={2}
                  value={pastProjectsSummary}
                  onChange={e => setPastProjectsSummary(e.target.value)}
                  placeholder="e.g. Supplied 300 desks for local education bureau in 2025; customized office partitions for private bank branch..."
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-600 bg-white"
                />
              </div>

              {/* Status explanation */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 space-y-1">
                <span className="font-semibold block text-slate-900">Verification Protocol:</span>
                <p className="text-[11px] text-slate-600">
                  Following submission, your profile will be registered with <strong>"Pending Review"</strong> status. An administrator will review your declared machinery and capacity. Verified badges are displayed only after administrative clearance.
                </p>
              </div>

              {isDone ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Workshop profile registered! Redirecting to your workspace...</span>
                </div>
              ) : (
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-medium hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5 text-teal-400" />
                    <span>{isSubmitting ? 'Registering Profile...' : 'Complete Registration'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
