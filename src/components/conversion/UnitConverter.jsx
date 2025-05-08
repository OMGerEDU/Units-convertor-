
import React, { useState, useEffect } from 'react';
import { useLanguage, useTranslation } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowRightLeft } from 'lucide-react';

// Custom event for history updates
const HISTORY_UPDATE_EVENT = 'conversionHistoryUpdate';

export default function UnitConverter({ category }) {
  const { language } = useLanguage();
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const text = {
    convert: { en: "Convert", he: "המר" },
    from: { en: "From", he: "מ-" },
    to: { en: "To", he: "ל-" },
    selectUnit: { en: "Select unit", he: "בחר יחידה" },
    result: { en: "Result", he: "תוצאה" },
    enterValue: { en: "Enter value", he: "הזן ערך" },
    swapUnits: { en: "Swap units", he: "החלף יחידות" }
  };

  useEffect(() => {
    // Set default from and to units when category changes
    if (category?.units?.length > 0) {
      setFromUnit(category.units[0].id);
      setToUnit(category.units.length > 1 ? category.units[1].id : category.units[0].id);
    }
    
    // Reset result when changing category
    setResult(null);
    setError(null);
  }, [category]);

  useEffect(() => {
    // Load conversion history from localStorage
    const savedHistory = localStorage.getItem('conversion-history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse conversion history:', error);
      }
    }

    // Event listener for history updates
    const handleHistoryUpdate = () => {
      const savedHistory = localStorage.getItem('conversion-history');
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (error) {
          console.error('Failed to parse conversion history:', error);
        }
      }
    };

    window.addEventListener(HISTORY_UPDATE_EVENT, handleHistoryUpdate);

    // Cleanup
    return () => {
      window.removeEventListener(HISTORY_UPDATE_EVENT, handleHistoryUpdate);
    };
  }, []);

  const handleConvert = () => {
    setError(null);
    
    if (!fromUnit || !toUnit) {
      setError({ en: "Please select units", he: "אנא בחר יחידות" });
      return;
    }
    
    const inputValue = parseFloat(value);
    if (isNaN(inputValue)) {
      setError({ en: "Please enter a valid number", he: "אנא הזן מספר תקין" });
      return;
    }

    let resultValue;
    const fromUnitObj = category.units.find(u => u.id === fromUnit);
    const toUnitObj = category.units.find(u => u.id === toUnit);
    
    if (!fromUnitObj || !toUnitObj) {
      setError({ en: "Invalid units selected", he: "יחידות שנבחרו אינן תקינות" });
      return;
    }

    // Special case for temperature
    if (category.name === 'temperature') {
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        resultValue = (inputValue * 9/5) + 32;
      } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
        resultValue = (inputValue - 32) * 5/9;
      } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
        resultValue = inputValue + 273.15;
      } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
        resultValue = inputValue - 273.15;
      } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
        resultValue = (inputValue - 32) * 5/9 + 273.15;
      } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
        resultValue = (inputValue - 273.15) * 9/5 + 32;
      } else {
        resultValue = inputValue; // Same unit
      }
    } else {
      // For other unit types, use the standard conversion calculation
      const fromFactor = fromUnitObj.conversion_factor;
      const toFactor = toUnitObj.conversion_factor;
      resultValue = (inputValue * fromFactor) / toFactor;
    }
    
    const resultObj = {
      value: resultValue,
      unit: toUnitObj
    };
    
    setResult(resultObj);
    
    // Save to history
    const newHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      category: category.name,
      fromValue: inputValue,
      fromUnit: fromUnitObj,
      toValue: resultValue,
      toUnit: toUnitObj,
      userValue: value,
      calculation: `${inputValue} ${fromUnitObj.symbol} = ${formatNumber(resultValue)} ${toUnitObj.symbol}`
    };

    // Get existing history
    const existingHistory = JSON.parse(localStorage.getItem('conversion-history') || '[]');
    const updatedHistory = [newHistoryItem, ...existingHistory].slice(0, 10);
    
    // Update localStorage
    localStorage.setItem('conversion-history', JSON.stringify(updatedHistory));
    
    // Dispatch custom event to notify history component
    window.dispatchEvent(new CustomEvent(HISTORY_UPDATE_EVENT));
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult(null);
  };

  const formatNumber = (num) => {
    // Format number to handle both large and small values
    if (Math.abs(num) < 0.000001 || Math.abs(num) > 1000000) {
      return num.toExponential(6);
    }
    
    // For standard numbers, adjust decimal places based on value
    const numStr = num.toString();
    const decimalPlaces = numStr.includes('.') ? numStr.split('.')[1].length : 0;
    
    if (Math.abs(num) < 0.1) {
      return num.toFixed(6);
    } else if (Math.abs(num) < 1) {
      return num.toFixed(4);
    } else if (Math.abs(num) < 10) {
      return num.toFixed(3);
    } else if (Math.abs(num) < 100) {
      return num.toFixed(2);
    } else {
      return num.toFixed(1);
    }
  };

  return (
    <Card className="shadow-md border-t-4 border-t-indigo-500 overflow-hidden w-full max-w-lg mx-auto">
      <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20">
        <CardTitle className="text-center text-indigo-900 dark:text-indigo-100">
          {useTranslation(category?.name, { en: category?.en, he: category?.he })}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 relative">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {useTranslation('from', text.from)}
              </label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger>
                  <SelectValue placeholder={useTranslation('select-unit', text.selectUnit)} />
                </SelectTrigger>
                <SelectContent>
                  {category?.units?.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.symbol} - {useTranslation(unit.id, { en: unit.en_name, he: unit.he_name })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Swap button positioned in the middle */}
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={handleSwapUnits}
              className="absolute left-1/2 top-8 -translate-x-1/2 rounded-full w-8 h-8 z-10 bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
              aria-label={useTranslation('swap-units', text.swapUnits)}
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {useTranslation('to', text.to)}
              </label>
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger>
                  <SelectValue placeholder={useTranslation('select-unit', text.selectUnit)} />
                </SelectTrigger>
                <SelectContent>
                  {category?.units?.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.symbol} - {useTranslation(unit.id, { en: unit.en_name, he: unit.he_name })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="relative">
            <label className="text-sm font-medium">
              {useTranslation('value', text.enterValue)}
            </label>
            <div className="mt-2">
              <Input 
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm text-center">
              {useTranslation('error', error)}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <Button 
          onClick={handleConvert}
          className="w-full"
        >
          {useTranslation('convert', text.convert)}
        </Button>
        
        {result && (
          <div className="w-full p-4 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {useTranslation('result', text.result)}:
            </div>
            <div className="text-2xl font-bold text-center">
              {formatNumber(result.value)} {result.unit.symbol}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
