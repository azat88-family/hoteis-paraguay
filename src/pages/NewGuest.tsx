import React, { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NewGuest: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Simulated form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would actually submit the data to your backend

    // Simulate successful submission
    navigate('/guests');
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
                  alt="Guest"
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
                  type="text"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.lastName', 'Last Name')}*
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.email', 'Email Address')}*
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.phone', 'Phone Number')}*
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.birthDate', 'Date of Birth')}
                </label>
                <input
                  id="birthDate"
                  type="date"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.nationality', 'Nationality')}*
                </label>
                <select
                  id="nationality"
                  required
                  className="w-full"
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
                  type="text"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.city', 'City')}
                </label>
                <input
                  id="city"
                  type="text"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.state', 'State/Province')}
                </label>
                <input
                  id="state"
                  type="text"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.postalCode', 'Postal Code')}
                </label>
                <input
                  id="postalCode"
                  type="text"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.country', 'Country')}
                </label>
                <select
                  id="country"
                  className="w-full"
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
                  className="w-full"
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
                    type="text"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="idExpiry" className="block text-sm font-medium text-slate-300 mb-2">
                    {t('guests.idExpiry', 'ID Expiry Date')}
                  </label>
                  <input
                    id="idExpiry"
                    type="date"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">
                  {t('guests.notes', 'Notes')}
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  placeholder={t('guests.notesPlaceholder', 'Enter any special requests or notes about the guest')}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Link to="/guests" className="btn-secondary py-2 px-6">
              {t('common.cancel', 'Cancel')}
            </Link>
            <button type="submit" className="btn-primary py-2 px-6">
              {t('guests.saveGuest', 'Save Guest')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewGuest;