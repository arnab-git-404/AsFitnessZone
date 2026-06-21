'use client';

import { useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Dumbbell, Ruler, Weight, Activity, Info } from 'lucide-react';

type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
];

const activityOptions = [
    { label: 'Sedentary (little or no exercise)', value: 'sedentary' },
    { label: 'Light (1-3 days/week)', value: 'light' },
    { label: 'Moderate (3-5 days/week)', value: 'moderate' },
    { label: 'Active (6-7 days/week)', value: 'active' },
    { label: 'Very Active (twice/day)', value: 'very-active' },
];

const activityMultipliers: Record<ActivityLevel, number> = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9,
};

export default function BMICalculatorPage() {
    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [gender, setGender] = useState<Gender>('male');
    const [activity, setActivity] = useState<ActivityLevel>('sedentary');
    const [results, setResults] = useState<{
        bmi: number;
        category: string;
        categoryColor: string;
        bmr: number;
        tdee: number;
    } | null>(null);
    const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

    const calculate = () => {
        if (!height || !weight || !age) return;

        const h = parseFloat(height);
        const w = parseFloat(weight);
        const a = parseInt(age, 10);
        if (isNaN(h) || isNaN(w) || isNaN(a)) return;

        let heightM: number;
        let weightKg: number;

        if (unit === 'metric') {
            heightM = h / 100;
            weightKg = w;
        } else {
            heightM = h * 0.0254;
            weightKg = w * 0.453592;
        }

        const bmi = weightKg / (heightM * heightM);
        const roundedBmi = Math.round(bmi * 10) / 10;

        let category: string;
        let categoryColor: string;

        if (bmi < 18.5) {
            category = 'Underweight';
            categoryColor = 'text-blue-500';
        } else if (bmi < 25) {
            category = 'Normal';
            categoryColor = 'text-green-500';
        } else if (bmi < 30) {
            category = 'Overweight';
            categoryColor = 'text-yellow-500';
        } else {
            category = 'Obese';
            categoryColor = 'text-red-500';
        }

        let bmr: number;
        if (gender === 'male') {
            bmr = 10 * weightKg + 6.25 * (heightM * 100) - 5 * a + 5;
        } else {
            bmr = 10 * weightKg + 6.25 * (heightM * 100) - 5 * a - 161;
        }

        const roundedBmr = Math.round(bmr);
        const tdee = Math.round(bmr * activityMultipliers[activity]);

        setResults({
            bmi: roundedBmi,
            category,
            categoryColor,
            bmr: roundedBmr,
            tdee,
        });
    };

    return (
        <div className="min-h-screen flex flex-col pt-16">
            {/* Hero */}
            <section className="py-16 bg-gradient-to-br from-background via-background to-primary/10">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold">
                            BMI & BMR <span className="text-primary">Calculator</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Calculate your Body Mass Index, Basal Metabolic Rate, and daily calorie needs — free for everyone.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Input Card */}
                        <Card className="!border-border/50">
                            <div className="p-6 space-y-5">
                                <h2 className="flex items-center gap-2 text-lg font-semibold">
                                    <Activity className="h-5 w-5 text-primary" />
                                    Your Details
                                </h2>

                                {/* Unit Toggle */}
                                <div className="flex gap-2">
                                    <Button
                                        className={unit === 'metric' ? 'bg-primary text-white border-primary' : 'p-button-outlined'}
                                        size="small"
                                        onClick={() => setUnit('metric')}
                                        label="Metric (cm / kg)"
                                    />
                                    <Button
                                        className={unit === 'imperial' ? 'bg-primary text-white border-primary' : 'p-button-outlined'}
                                        size="small"
                                        onClick={() => setUnit('imperial')}
                                        label="Imperial (in / lbs)"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{unit === 'metric' ? 'Height (cm)' : 'Height (in)'}</label>
                                        <div className="relative">
                                            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                            <InputText
                                                type="number"
                                                value={height}
                                                onChange={(e) => setHeight(e.target.value)}
                                                placeholder={unit === 'metric' ? '170' : '67'}
                                                className="w-full pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}</label>
                                        <div className="relative">
                                            <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                                            <InputText
                                                type="number"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                                placeholder={unit === 'metric' ? '70' : '154'}
                                                className="w-full pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Age</label>
                                        <InputText
                                            type="number"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                            placeholder="25"
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Gender</label>
                                        <Dropdown
                                            value={gender}
                                            options={genderOptions}
                                            onChange={(e) => setGender(e.value)}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Activity Level</label>
                                    <Dropdown
                                        value={activity}
                                        options={activityOptions}
                                        onChange={(e) => setActivity(e.value)}
                                        className="w-full"
                                    />
                                </div>

                                <Button
                                    className="w-full bg-primary text-white border-primary"
                                    size="large"
                                    onClick={calculate}
                                    disabled={!height || !weight || !age}
                                    label="Calculate"
                                />
                            </div>
                        </Card>

                        {/* Results Card */}
                        <Card className="!border-border/50">
                            <div className="p-6 space-y-6">
                                <h2 className="flex items-center gap-2 text-lg font-semibold">
                                    <Info className="h-5 w-5 text-primary" />
                                    Your Results
                                </h2>

                                {results ? (
                                    <>
                                        {/* BMI */}
                                        <div className="text-center p-6 bg-card border border-border rounded-xl">
                                            <p className="text-sm text-muted-foreground mb-1">Your BMI</p>
                                            <p className="text-5xl font-bold">{results.bmi}</p>
                                            <p className={`text-lg font-semibold mt-1 ${results.categoryColor}`}>
                                                {results.category}
                                            </p>
                                        </div>

                                        {/* BMI Scale */}
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">BMI Scale</p>
                                            <div className="h-3 rounded-full overflow-hidden flex">
                                                <div className="flex-1 bg-blue-400" />
                                                <div className="flex-1 bg-green-500" />
                                                <div className="flex-1 bg-yellow-500" />
                                                <div className="flex-1 bg-red-500" />
                                            </div>
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>18.5</span>
                                                <span>25</span>
                                                <span>30</span>
                                            </div>
                                        </div>

                                        {/* BMR & TDEE */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-card border border-border rounded-xl text-center">
                                                <p className="text-sm text-muted-foreground">BMR</p>
                                                <p className="text-2xl font-bold">{results.bmr}</p>
                                                <p className="text-xs text-muted-foreground">calories/day</p>
                                            </div>
                                            <div className="p-4 bg-card border border-border rounded-xl text-center">
                                                <p className="text-sm text-muted-foreground">TDEE</p>
                                                <p className="text-2xl font-bold text-primary">{results.tdee}</p>
                                                <p className="text-xs text-muted-foreground">calories/day</p>
                                            </div>
                                        </div>

                                        <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/50 rounded-lg">
                                            <p><strong>BMR:</strong> Calories your body needs at complete rest.</p>
                                            <p><strong>TDEE:</strong> Total Daily Energy Expenditure — calories needed to maintain weight at your activity level.</p>
                                            <p className="italic">For weight loss, aim for 300-500 calories below your TDEE.</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-80 text-center text-muted-foreground space-y-4">
                                        <Dumbbell className="h-12 w-12 text-primary/30" />
                                        <p>Enter your details and click Calculate to see your results.</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
