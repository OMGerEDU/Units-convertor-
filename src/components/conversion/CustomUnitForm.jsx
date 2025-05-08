import React, { useState } from 'react';
import { useLanguage, useTranslation } from '../context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function CustomUnitForm({ categories, onUnitAdded }) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    category: '',
    unitName_en: '',
    unitName_he: '',
    symbol: '',
    conversionFactor: ''
  });
  const [errors, setErrors] = useState({});

  const text = {
    title: { en: "Add Custom Unit", he: "הוסף יחידה מותאמת אישית" },
    category: { en: "Category", he: "קטגוריה" },
    selectCategory: { en: "Select category", he: "בחר קטגוריה" },
    nameEn: { en: "Unit name (English)", he: "שם היחידה (אנגלית)" },
    nameHe: { en: "Unit name (Hebrew)", he: "שם היחידה (עברית)" },
    symbol: { en: "Symbol", he: "סמל" },
    conversionFactor: { en: "Conversion factor", he: "מקדם המרה" },
    addUnit: { en: "Add Unit", he: "הוסף יחידה" },
    unitAdded: { en: "Unit added successfully", he: "היחידה נוספה בהצלחה" },
    fillAllFields: { en: "Please fill all fields", he: "אנא מלא את כל השדות" },
    invalidFactor: { en: "Conversion factor must be a number", he: "מקדם ההמרה חייב להיות מספר" }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category) newErrors.category = true;
    if (!formData.unitName_en) newErrors.unitName_en = true;
    if (!formData.unitName_he) newErrors.unitName_he = true;
    if (!formData.symbol) newErrors.symbol = true;
    if (!formData.conversionFactor) {
      newErrors.conversionFactor = true;
    } else if (isNaN(parseFloat(formData.conversionFactor))) {
      newErrors.conversionFactor = 'invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: useTranslation('error', text.fillAllFields),
        variant: "destructive"
      });
      return;
    }
    
    // Create custom unit object
    const newUnit = {
      id: `custom_${formData.unitName_en.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      en_name: formData.unitName_en,
      he_name: formData.unitName_he,
      symbol: formData.symbol,
      conversion_factor: parseFloat(formData.conversionFactor),
      isCustom: true
    };
    
    // Get existing custom units from localStorage
    const customUnitsStr = localStorage.getItem('custom-units');
    let customUnits = customUnitsStr ? JSON.parse(customUnitsStr) : {};
    
    // Add new unit to the appropriate category
    if (!customUnits[formData.category]) {
      customUnits[formData.category] = [];
    }
    
    customUnits[formData.category].push(newUnit);
    
    // Save back to localStorage
    localStorage.setItem('custom-units', JSON.stringify(customUnits));
    
    // Reset form
    setFormData({
      category: formData.category, // Keep the category selected
      unitName_en: '',
      unitName_he: '',
      symbol: '',
      conversionFactor: ''
    });
    
    // Notify parent component
    if (onUnitAdded) {
      onUnitAdded(formData.category, newUnit);
    }
    
    toast({
      title: useTranslation('unit-added', text.unitAdded),
      description: `${newUnit.en_name} (${newUnit.symbol})`,
    });
  };

  return (
    <Card className="mt-8 shadow-md overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-900/20">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-indigo-500" />
          <span>{useTranslation('add-custom-unit', text.title)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">
              {useTranslation('category', text.category)}
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger id="category" className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder={useTranslation('select-category', text.selectCategory)} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {useTranslation(category.name, { en: category.en, he: category.he })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitName_en">
                {useTranslation('name-en', text.nameEn)}
              </Label>
              <Input
                id="unitName_en"
                value={formData.unitName_en}
                onChange={(e) => handleChange('unitName_en', e.target.value)}
                className={errors.unitName_en ? 'border-red-500' : ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unitName_he">
                {useTranslation('name-he', text.nameHe)}
              </Label>
              <Input
                id="unitName_he"
                value={formData.unitName_he}
                onChange={(e) => handleChange('unitName_he', e.target.value)}
                className={errors.unitName_he ? 'border-red-500' : ''}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">
                {useTranslation('symbol', text.symbol)}
              </Label>
              <Input
                id="symbol"
                value={formData.symbol}
                onChange={(e) => handleChange('symbol', e.target.value)}
                className={errors.symbol ? 'border-red-500' : ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="conversionFactor">
                {useTranslation('conversion-factor', text.conversionFactor)}
              </Label>
              <Input
                id="conversionFactor"
                type="text"
                value={formData.conversionFactor}
                onChange={(e) => handleChange('conversionFactor', e.target.value)}
                className={errors.conversionFactor ? 'border-red-500' : ''}
              />
              {errors.conversionFactor === 'invalid' && (
                <p className="text-red-500 text-xs mt-1">
                  {useTranslation('invalid-factor', text.invalidFactor)}
                </p>
              )}
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            <PlusCircle className="h-4 w-4 mr-2" />
            {useTranslation('add-unit', text.addUnit)}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}