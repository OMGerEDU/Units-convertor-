
import React, { useState, useEffect } from 'react';
import { LanguageProvider } from '../components/context/LanguageContext';
import { AccessibilityProvider } from '../components/context/AccessibilityContext';
import { useLanguage, useTranslation } from '../components/context/LanguageContext';
import Navbar from '../components/ui/Navbar';
import AccessibilityMenu from '../components/ui/AccessibilityMenu';
import UnitConverter from '../components/conversion/UnitConverter';
import ConversionHistory from '../components/conversion/ConversionHistory';
import CustomUnitForm from '../components/conversion/CustomUnitForm';
import BackToTop from '../components/ui/BackToTop';
import CookieConsent from '../components/ui/CookieConsent';
import GuidedTour from '../components/ui/GuidedTour';
import { Ruler, Weight, Thermometer, Clock, Calculator, Database, TrendingUp, Gauge, Zap, Shrink } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

// Define all unit categories and their units
const defaultCategories = [
  {
    name: 'length',
    en: 'Length',
    he: 'אורך',
    icon: Ruler,
    units: [
      { id: 'meter', en_name: 'Meter', he_name: 'מטר', symbol: 'm', conversion_factor: 1 },
      { id: 'kilometer', en_name: 'Kilometer', he_name: 'קילומטר', symbol: 'km', conversion_factor: 1000 },
      { id: 'centimeter', en_name: 'Centimeter', he_name: 'סנטימטר', symbol: 'cm', conversion_factor: 0.01 },
      { id: 'millimeter', en_name: 'Millimeter', he_name: 'מילימטר', symbol: 'mm', conversion_factor: 0.001 },
      { id: 'mile', en_name: 'Mile', he_name: 'מייל', symbol: 'mi', conversion_factor: 1609.34 },
      { id: 'yard', en_name: 'Yard', he_name: 'יארד', symbol: 'yd', conversion_factor: 0.9144 },
      { id: 'foot', en_name: 'Foot', he_name: 'רגל', symbol: 'ft', conversion_factor: 0.3048 },
      { id: 'inch', en_name: 'Inch', he_name: 'אינצ\'', symbol: 'in', conversion_factor: 0.0254 },
      { id: 'nanometer', en_name: 'Nanometer', he_name: 'ננומטר', symbol: 'nm', conversion_factor: 1e-9 }
    ]
  },
  {
    name: 'mass',
    en: 'Mass',
    he: 'מסה',
    icon: Weight,
    units: [
      { id: 'kilogram', en_name: 'Kilogram', he_name: 'קילוגרם', symbol: 'kg', conversion_factor: 1 },
      { id: 'gram', en_name: 'Gram', he_name: 'גרם', symbol: 'g', conversion_factor: 0.001 },
      { id: 'milligram', en_name: 'Milligram', he_name: 'מיליגרם', symbol: 'mg', conversion_factor: 0.000001 },
      { id: 'ton', en_name: 'Ton', he_name: 'טון', symbol: 't', conversion_factor: 1000 },
      { id: 'pound', en_name: 'Pound', he_name: 'פאונד', symbol: 'lb', conversion_factor: 0.453592 },
      { id: 'ounce', en_name: 'Ounce', he_name: 'אונקיה', symbol: 'oz', conversion_factor: 0.0283495 }
    ]
  },
  {
    name: 'volume',
    en: 'Volume',
    he: 'נפח',
    icon: Calculator,
    units: [
      { id: 'liter', en_name: 'Liter', he_name: 'ליטר', symbol: 'L', conversion_factor: 1 },
      { id: 'milliliter', en_name: 'Milliliter', he_name: 'מיליליטר', symbol: 'mL', conversion_factor: 0.001 },
      { id: 'cubic_meter', en_name: 'Cubic Meter', he_name: 'מטר מעוקב', symbol: 'm³', conversion_factor: 1000 },
      { id: 'gallon_us', en_name: 'Gallon (US)', he_name: 'גלון (ארה"ב)', symbol: 'gal', conversion_factor: 3.78541 },
      { id: 'gallon_uk', en_name: 'Gallon (UK)', he_name: 'גלון (בריטניה)', symbol: 'gal', conversion_factor: 4.54609 },
      { id: 'quart', en_name: 'Quart', he_name: 'קוורט', symbol: 'qt', conversion_factor: 0.946353 },
      { id: 'pint', en_name: 'Pint', he_name: 'פיינט', symbol: 'pt', conversion_factor: 0.473176 },
      { id: 'fluid_ounce', en_name: 'Fluid Ounce', he_name: 'אונקיה נוזלית', symbol: 'fl oz', conversion_factor: 0.0295735 }
    ]
  },
  {
    name: 'temperature',
    en: 'Temperature',
    he: 'טמפרטורה',
    icon: Thermometer,
    units: [
      { id: 'celsius', en_name: 'Celsius', he_name: 'צלזיוס', symbol: '°C', conversion_factor: 1 },
      { id: 'fahrenheit', en_name: 'Fahrenheit', he_name: 'פרנהייט', symbol: '°F', conversion_factor: 1 }, // Special handling
      { id: 'kelvin', en_name: 'Kelvin', he_name: 'קלווין', symbol: 'K', conversion_factor: 1 }  // Special handling
    ]
  },
  {
    name: 'area',
    en: 'Area',
    he: 'שטח',
    icon: Shrink,
    units: [
      { id: 'square_meter', en_name: 'Square Meter', he_name: 'מטר מרובע', symbol: 'm²', conversion_factor: 1 },
      { id: 'square_kilometer', en_name: 'Square Kilometer', he_name: 'קילומטר מרובע', symbol: 'km²', conversion_factor: 1000000 },
      { id: 'square_foot', en_name: 'Square Foot', he_name: 'רגל מרובע', symbol: 'ft²', conversion_factor: 0.092903 },
      { id: 'square_inch', en_name: 'Square Inch', he_name: 'אינצ\' מרובע', symbol: 'in²', conversion_factor: 0.00064516 },
      { id: 'acre', en_name: 'Acre', he_name: 'אקר', symbol: 'ac', conversion_factor: 4046.86 },
      { id: 'hectare', en_name: 'Hectare', he_name: 'הקטר', symbol: 'ha', conversion_factor: 10000 }
    ]
  },
  {
    name: 'speed',
    en: 'Speed',
    he: 'מהירות',
    icon: TrendingUp,
    units: [
      { id: 'meter_per_second', en_name: 'Meter per Second', he_name: 'מטר לשנייה', symbol: 'm/s', conversion_factor: 1 },
      { id: 'kilometer_per_hour', en_name: 'Kilometer per Hour', he_name: 'קילומטר לשעה', symbol: 'km/h', conversion_factor: 0.277778 },
      { id: 'mile_per_hour', en_name: 'Mile per Hour', he_name: 'מייל לשעה', symbol: 'mph', conversion_factor: 0.44704 },
      { id: 'knot', en_name: 'Knot', he_name: 'קשר', symbol: 'kn', conversion_factor: 0.514444 }
    ]
  },
  {
    name: 'time',
    en: 'Time',
    he: 'זמן',
    icon: Clock,
    units: [
      { id: 'second', en_name: 'Second', he_name: 'שנייה', symbol: 's', conversion_factor: 1 },
      { id: 'minute', en_name: 'Minute', he_name: 'דקה', symbol: 'min', conversion_factor: 60 },
      { id: 'hour', en_name: 'Hour', he_name: 'שעה', symbol: 'h', conversion_factor: 3600 },
      { id: 'day', en_name: 'Day', he_name: 'יום', symbol: 'd', conversion_factor: 86400 },
      { id: 'week', en_name: 'Week', he_name: 'שבוע', symbol: 'wk', conversion_factor: 604800 }
    ]
  },
  {
    name: 'digital_storage',
    en: 'Digital Storage',
    he: 'אחסון דיגיטלי',
    icon: Database,
    units: [
      { id: 'byte', en_name: 'Byte', he_name: 'בייט', symbol: 'B', conversion_factor: 1 },
      { id: 'kilobyte', en_name: 'Kilobyte', he_name: 'קילובייט', symbol: 'KB', conversion_factor: 1024 },
      { id: 'megabyte', en_name: 'Megabyte', he_name: 'מגה-בייט', symbol: 'MB', conversion_factor: 1048576 },
      { id: 'gigabyte', en_name: 'Gigabyte', he_name: 'ג\'יגה-בייט', symbol: 'GB', conversion_factor: 1073741824 },
      { id: 'terabyte', en_name: 'Terabyte', he_name: 'טרה-בייט', symbol: 'TB', conversion_factor: 1099511627776 }
    ]
  },
  {
    name: 'pressure',
    en: 'Pressure',
    he: 'לחץ',
    icon: Gauge,
    units: [
      { id: 'pascal', en_name: 'Pascal', he_name: 'פסקל', symbol: 'Pa', conversion_factor: 1 },
      { id: 'kilopascal', en_name: 'Kilopascal', he_name: 'קילופסקל', symbol: 'kPa', conversion_factor: 1000 },
      { id: 'bar', en_name: 'Bar', he_name: 'בר', symbol: 'bar', conversion_factor: 100000 },
      { id: 'psi', en_name: 'Pound per Square Inch', he_name: 'פאונד לאינץ\' מרובע', symbol: 'psi', conversion_factor: 6894.76 },
      { id: 'atmosphere', en_name: 'Atmosphere', he_name: 'אטמוספירה', symbol: 'atm', conversion_factor: 101325 }
    ]
  },
  {
    name: 'energy',
    en: 'Energy',
    he: 'אנרגיה',
    icon: Zap,
    units: [
      { id: 'joule', en_name: 'Joule', he_name: 'ג\'ול', symbol: 'J', conversion_factor: 1 },
      { id: 'kilojoule', en_name: 'Kilojoule', he_name: 'קילוג\'ול', symbol: 'kJ', conversion_factor: 1000 },
      { id: 'calorie', en_name: 'Calorie', he_name: 'קלוריה', symbol: 'cal', conversion_factor: 4.184 },
      { id: 'kilocalorie', en_name: 'Kilocalorie', he_name: 'קילוקלוריה', symbol: 'kcal', conversion_factor: 4184 }
    ]
  }
];

// Separate the main content into a new component
function MainContent() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const text = {
    heroTitle: { en: "Convert Units Instantly", he: "המרת יחידות בזמן אמת" },
    heroSubtitle: { 
      en: "Supports length, mass, volume, temperature & more", 
      he: "תומך באורך, מסה, נפח, טמפרטורה ועוד" 
    },
    footer: {
      copyright: { en: "© 2025 OMGerEDU", he: "© 2025 OMGerEDU" },
      rights: { en: "All rights reserved", he: "כל הזכויות שמורות" },
      linkedin: { en: "LinkedIn", he: "לינקדאין" },
      github: { en: "GitHub", he: "גיטהאב" },
      license: { en: "License", he: "רישיון" }
    }
  };

  useEffect(() => {
    // Load custom units from localStorage and merge with default categories
    const loadCustomUnits = () => {
      setIsLoading(true);
      
      const customUnitsStr = localStorage.getItem('custom-units');
      if (customUnitsStr) {
        try {
          const customUnits = JSON.parse(customUnitsStr);
          
          // Create a deep copy of default categories
          const updatedCategories = JSON.parse(JSON.stringify(defaultCategories));
          
          // Add custom units to each category
          Object.keys(customUnits).forEach(categoryName => {
            const categoryIndex = updatedCategories.findIndex(c => c.name === categoryName);
            if (categoryIndex !== -1) {
              updatedCategories[categoryIndex].units = [
                ...updatedCategories[categoryIndex].units,
                ...customUnits[categoryName]
              ];
            }
          });
          
          setCategories(updatedCategories);
        } catch (error) {
          console.error('Failed to parse custom units:', error);
        }
      }
      
      setIsLoading(false);
    };
    
    loadCustomUnits();
  }, []);

  const handleUnitAdded = (categoryName, newUnit) => {
    setCategories(prevCategories => {
      const updatedCategories = JSON.parse(JSON.stringify(prevCategories));
      const categoryIndex = updatedCategories.findIndex(c => c.name === categoryName);
      
      if (categoryIndex !== -1) {
        updatedCategories[categoryIndex].units.push(newUnit);
      }
      
      return updatedCategories;
    });
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${language === 'he' ? 'rtl' : 'ltr'}`}>
      <Navbar categories={categories} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center my-12">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 dark:text-indigo-100 mb-4">
            {useTranslation('hero-title', text.heroTitle)}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {useTranslation('hero-subtitle', text.heroSubtitle)}
          </p>
        </section>

        {/* Category Navigation */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  id={category.name}
                  onClick={() => setSelectedCategoryIndex(index)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                    selectedCategoryIndex === index 
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900 dark:border-indigo-700 dark:text-indigo-100' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{useTranslation(category.name, { en: category.en, he: category.he })}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Converter Card */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <UnitConverter category={categories[selectedCategoryIndex]} />
            </div>
            <div>
              <ConversionHistory />
            </div>
          </div>
        </section>

        {/* Custom Unit Form */}
        <section className="mb-12">
          <CustomUnitForm 
            categories={categories}
            onUnitAdded={handleUnitAdded}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
              <p>{useTranslation('copyright', text.footer.copyright)}</p>
              <p className="text-sm">{useTranslation('rights', text.footer.rights)}</p>
            </div>
            <div className="flex gap-6">
              <a 
                href="https://linkedin.com/in/omger" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {useTranslation('linkedin', text.footer.linkedin)}
              </a>
              <a 
                href="https://github.com/OMGerEDU" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {useTranslation('github', text.footer.github)}
              </a>
              <a 
                href="#" 
                className="text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {useTranslation('license', text.footer.license)}
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Additional Components */}
      <AccessibilityMenu />
      <BackToTop />
      <CookieConsent />
      <GuidedTour />
      <Toaster />
    </div>
  );
}

// Main App component that wraps everything with providers
export default function App() {
  return (
    <AccessibilityProvider>
      <LanguageProvider>
        <MainContent />
      </LanguageProvider>
    </AccessibilityProvider>
  );
}
