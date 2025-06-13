import React, { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createGuest } from '../apiService/guestService'; // Adjusted import path

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Add other fields as necessary, matching your form
  birthDate?: string;
  nationality?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  idType?: string;
  idNumber?: string;
  idExpiry?: string;
  notes?: string;
}

const NewGuestPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const guestData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
    };

    if (!guestData.name || !guestData.email) {
      setError(t('guests.errors.nameEmailRequired', 'Full name and email are required.'));
      setIsLoading(false);
      return;
    }

    try {
      await createGuest(guestData);
      setSuccessMessage(t('guests.success.guestCreated', 'Guest created successfully! Redirecting...'));
      // Clear form or reset state if needed
      setFormData({ firstName: '', lastName: '', email: '', phone: '' });
      setTimeout(() => {
        navigate('/guests');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('guests.errors.unknownError', 'An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection for guest photo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Link to="/guests" className="p-2 rounded-full hover:bg-slate-700 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-white">{t('guests.addNew')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Photo upload and personal details */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg overflow-hidden p-6">
            <h2 className="text-lg font-bold mb-4">{t('guests.photo', 'Guest Photo')}</h2>

            {!selectedImage ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-lg p-8 hover:border-blue-500 transition-colors">
                <div className="p-3 bg-blue-500 bg-opacity-10 rounded-full mb-4">
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-slate-300 mb-2 text-center">{t('guests.photoHint', 'Drag and drop a photo here or click to browse')}</p>
                <p className="text-slate-400 text-sm text-center mb-4">{t('guests.photoFormats', 'JPG, PNG or GIF, max 5MB')}</p>
                <label className="btn-primary cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {t('guests.choosePhoto', 'Choose Photo')}
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt={t('guests.photo', 'Guest Photo')}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-slate-800 rounded-full hover:bg-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="bg-slate-800 rounded-lg overflow-hidden p-6">
            <h2 className="text-lg font-bold mb-4">{t('guests.documents', 'Documents')}</h2>

            <div className="space-y-4">
              <div className="border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{t('guests.id', 'Identification')}</h3>
                  <div className="px-2 py-1 bg-yellow-500 bg-opacity-10 text-yellow-500 rounded-full text-xs">
                    {t('guests.required', 'Required')}
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-4">{t('guests.uploadIdHint', 'Upload passport or ID card')}</p>
                <label className="btn-secondary cursor-pointer text-sm inline-flex items-center">
                  <input type="file" className="hidden" />
                  <Upload size={14} className="mr-1.5" />
                  {t('guests.uploadId', 'Upload ID')}
                </label>
              </div>

              <div className="border border-slate-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{t('guests.visa', 'Visa (if applicable)')}</h3>
                  <div className="px-2 py-1 bg-slate-500 bg-opacity-10 text-slate-400 rounded-full text-xs">
                    {t('guests.optional', 'Optional')}
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-4">{t('guests.visaHint', 'For international guests')}</p>
                <label className="btn-secondary cursor-pointer text-sm inline-flex items-center">
                  <input type="file" className="hidden" />
                  <Upload size={14} className="mr-1.5" />
                  {t('guests.uploadVisa', 'Upload Visa')}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Middle and Right columns - Form fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 rounded-lg overflow-hidden p-6">
            <h2 className="text-lg font-bold mb-6">{t('guests.personalInfo', 'Personal Information')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.firstName', 'First Name')}*
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="w-full"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.lastName', 'Last Name')}*
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="w-full"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.email', 'Email Address')}*
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.phone', 'Phone Number')}*
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required // Making phone required as per original form, though schema allows null
                  className="w-full"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.birthDate', 'Date of Birth')}
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  className="w-full"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.nationality', 'Nationality')}
                </label>
                <select
                  id="nationality"
                  name="nationality"
                  // not required as it's not in the core guest data for backend
                  className="w-full"
                  value={formData.nationality}
                  onChange={handleInputChange}
                >
                  <option value="">{t('guests.selectCountry', 'Select country')}</option>
                  <option value="US">{t('guests.country.us', 'United States')}</option>
                  <option value="UK">{t('guests.country.uk', 'United Kingdom')}</option>
                  <option value="BR">{t('guests.country.br', 'Brasil')}</option>
                  <option value="CA">{t('guests.country.ca', 'Canada')}</option>
                  <option value="AU">{t('guests.country.au', 'Australia')}</option>
                  <option value="FR">{t('guests.country.fr', 'France')}</option>
                  <option value="DE">{t('guests.country.de', 'Germany')}</option>
                  <option value="JP">{t('guests.country.jp', 'Japan')}</option>
                  <option value="Other">{t('guests.country.other', 'Other')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg overflow-hidden p-6">
            <h2 className="text-lg font-bold mb-6">{t('guests.addressInfo', 'Address Information')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.address', 'Street Address')}
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="w-full"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.city', 'City')}
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className="w-full"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.state', 'State/Province')}
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  className="w-full"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.postalCode', 'Postal Code')}
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  className="w-full"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.country', 'Country')}
                </label>
                <select
                  id="country"
                  name="country"
                  className="w-full"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="">{t('guests.selectCountry', 'Select country')}</option>
                  <option value="US">{t('guests.country.us', 'United States')}</option>
                  <option value="UK">{t('guests.country.uk', 'United Kingdom')}</option>
                  <option value="BR">{t('guests.country.br', 'Brasil')}</option>
                  <option value="CA">{t('guests.country.ca', 'Canada')}</option>
                  <option value="AU">{t('guests.country.au', 'Australia')}</option>
                  <option value="Other">{t('guests.country.other', 'Other')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg overflow-hidden p-6">
            <h2 className="text-lg font-bold mb-6">{t('guests.additionalInfo', 'Additional Information')}</h2>

            <div className="space-y-6">
              <div>
                <label htmlFor="idType" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.idType', 'ID Type')}
                </label>
                <select
                  id="idType"
                  name="idType"
                  className="w-full"
                  value={formData.idType}
                  onChange={handleInputChange}
                >
                  <option value="">{t('guests.selectIdType', 'Select ID type')}</option>
                  <option value="passport">{t('guests.passport', "Passport")}</option>
                  <option value="driverLicense">{t('guests.driverLicense', "Driver's License")}</option>
                  <option value="nationalId">{t('guests.nationalId', "National ID")}</option>
                  <option value="other">{t('guests.other', "Other")}</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="idNumber" className="block text-sm font-medium text-slate-300 mb-2">
                    {t('guests.idNumber', 'ID Number')}
                  </label>
                  <input
                    id="idNumber"
                    name="idNumber"
                    type="text"
                    className="w-full"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="idExpiry" className="block text-sm font-medium text-slate-300 mb-2">
                    {t('guests.idExpiry', 'ID Expiry Date')}
                  </label>
                  <input
                    id="idExpiry"
                    name="idExpiry"
                    type="date"
                    className="w-full"
                    value={formData.idExpiry}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.notes', 'Notes')}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder={t('guests.notesPlaceholder', 'Enter any special requests or notes about the guest')}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          </div>

          {error && (
            <div className="lg:col-span-3 p-4 bg-red-900 text-red-300 rounded-md">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="lg:col-span-3 p-4 bg-green-900 text-green-300 rounded-md">
              {successMessage}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Link to="/guests" className="btn-secondary py-2 px-6">
              {t('common.cancel', 'Cancel')}
            </Link>
            <button type="submit" className="btn-primary py-2 px-6" disabled={isLoading}>
              {isLoading ? t('common.saving', 'Saving...') : t('guests.saveGuest', 'Save Guest')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewGuestPage;