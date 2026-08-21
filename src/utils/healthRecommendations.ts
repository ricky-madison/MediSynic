
import { UserData, Recommendation, DrugInteraction, VitaminRecommendation } from '@/context/UserDataContext';

// Mock database of drug interactions relevant to diabetes medications
const DRUG_INTERACTIONS_DB: Record<string, Record<string, { severity: 'high' | 'medium' | 'low', description: string }>> = {
  'insulin': {
    'beta-blockers': {
      severity: 'medium',
      description: 'Beta-blockers may mask hypoglycemic symptoms and prolong hypoglycemia. Monitor blood glucose closely.'
    },
    'ace inhibitors': {
      severity: 'low',
      description: 'ACE inhibitors may increase insulin sensitivity. Monitor for signs of hypoglycemia.'
    },
    'alcohol': {
      severity: 'high',
      description: 'Alcohol may cause hypoglycemia, especially when taken with insulin. Limit alcohol consumption.'
    }
  },
  'metformin': {
    'iodinated contrast': {
      severity: 'high',
      description: 'Temporarily discontinue metformin before and after imaging procedures with iodinated contrast to avoid lactic acidosis risk.'
    },
    'diuretics': {
      severity: 'medium',
      description: 'May increase risk of lactic acidosis. Monitor kidney function and stay hydrated.'
    },
    'corticosteroids': {
      severity: 'medium',
      description: 'May decrease effectiveness of metformin. More frequent glucose monitoring recommended.'
    }
  },
  'sulfonylureas': {
    'nsaids': {
      severity: 'medium',
      description: 'NSAIDs may increase risk of hypoglycemia. Monitor blood glucose more frequently.'
    },
    'fluoroquinolones': {
      severity: 'medium',
      description: 'May increase risk of hypoglycemia. Be alert for symptoms like dizziness and confusion.'
    },
    'alcohol': {
      severity: 'medium',
      description: 'May cause disulfiram-like reaction and increase hypoglycemia risk. Avoid alcohol.'
    }
  },
  'dpp-4 inhibitors': {
    'insulin': {
      severity: 'low',
      description: 'Combined use may increase risk of hypoglycemia. Insulin dose may need adjustment.'
    },
    'sulfonylureas': {
      severity: 'medium',
      description: 'Combined use significantly increases hypoglycemia risk. Lower sulfonylurea dose may be needed.'
    }
  },
  'sglt2 inhibitors': {
    'diuretics': {
      severity: 'medium',
      description: 'May increase risk of dehydration and low blood pressure. Stay hydrated and monitor blood pressure.'
    },
    'insulin': {
      severity: 'low',
      description: 'May increase risk of hypoglycemia. Insulin dose adjustment may be needed.'
    },
    'nsaids': {
      severity: 'medium',
      description: 'May increase kidney-related side effects. Monitor kidney function when using together.'
    }
  },
  'glp-1 agonists': {
    'oral medications': {
      severity: 'low',
      description: 'May slow absorption of oral medications due to delayed gastric emptying. Take oral medications at least 1 hour before GLP-1 agonist.'
    },
    'insulin': {
      severity: 'low',
      description: 'Combined use may increase risk of hypoglycemia. Insulin dose adjustment may be needed.'
    }
  }
};

// Mock database of vitamin recommendations for diabetics
const MEDICATION_VITAMIN_DEFICIENCIES: Record<string, { vitamin: string, dosage: string, reason: string, foodSources: string[] }[]> = {
  'metformin': [
    {
      vitamin: 'Vitamin B12',
      dosage: '1,000 mcg daily',
      reason: 'Metformin can reduce B12 absorption over time, potentially leading to deficiency',
      foodSources: ['Beef', 'Liver', 'Clams', 'Eggs', 'Fortified cereals']
    },
    {
      vitamin: 'Folic Acid',
      dosage: '400 mcg daily',
      reason: 'Works with B12 for proper cell function and can help offset B12 deficiencies',
      foodSources: ['Leafy greens', 'Broccoli', 'Legumes', 'Oranges']
    }
  ],
  'insulin': [
    {
      vitamin: 'Chromium',
      dosage: '200-1,000 mcg daily',
      reason: 'May help improve insulin sensitivity and glucose metabolism',
      foodSources: ['Whole grains', 'Broccoli', 'Green beans', 'Nuts']
    },
    {
      vitamin: 'Magnesium',
      dosage: '300-400 mg daily',
      reason: 'Important for glucose metabolism and insulin sensitivity',
      foodSources: ['Almonds', 'Spinach', 'Black beans', 'Avocados']
    }
  ],
  'sglt2 inhibitors': [
    {
      vitamin: 'Vitamin D',
      dosage: '1,000-2,000 IU daily',
      reason: 'May help with blood sugar control and reduce inflammation',
      foodSources: ['Fatty fish', 'Egg yolks', 'Fortified foods']
    },
    {
      vitamin: 'Calcium',
      dosage: '1,000-1,200 mg daily',
      reason: 'SGLT2 inhibitors may increase risk of bone mineral density loss',
      foodSources: ['Dairy products', 'Leafy greens', 'Fortified plant milks']
    }
  ],
  'sulfonylureas': [
    {
      vitamin: 'Alpha-Lipoic Acid',
      dosage: '600-1,200 mg daily',
      reason: 'May help protect against oxidative stress and improve insulin sensitivity',
      foodSources: ['Spinach', 'Broccoli', 'Yeast', 'Organ meats']
    },
    {
      vitamin: 'CoQ10',
      dosage: '100-200 mg daily',
      reason: 'May help improve energy production and reduce oxidative stress',
      foodSources: ['Fatty fish', 'Organ meats', 'Whole grains']
    }
  ]
};

// Diabetes-specific vitamin recommendations based on conditions and lifestyle
const getLifestyleVitaminRecommendations = (userData: Partial<UserData>): VitaminRecommendation[] => {
  const recommendations: VitaminRecommendation[] = [];
  
  // Add diabetic-specific vitamin recommendations regardless of other factors
  recommendations.push({
    name: 'Alpha-Lipoic Acid',
    dosage: '600-1,200 mg daily',
    reason: 'May help with diabetic neuropathy and improve insulin sensitivity',
    foodSources: ['Spinach', 'Broccoli', 'Yeast', 'Organ meats']
  });
  
  recommendations.push({
    name: 'Magnesium',
    dosage: '300-400 mg daily',
    reason: 'Important for glucose metabolism and often deficient in diabetics',
    foodSources: ['Almonds', 'Spinach', 'Black beans', 'Avocados']
  });
  
  // Exercise and activity level recommendations for diabetics
  if (userData.exerciseFrequency === 'active' || userData.exerciseFrequency === 'very-active') {
    recommendations.push({
      name: 'Electrolytes',
      dosage: 'As needed after exercise',
      reason: 'Replaces minerals lost through sweat and helps maintain hydration, important for glucose stability',
      foodSources: ['Coconut water', 'Bananas', 'Sports drinks (sugar-free)', 'Salted nuts']
    });
  } else if (userData.exerciseFrequency === 'sedentary' || userData.exerciseFrequency === 'lightly-active') {
    recommendations.push({
      name: 'Chromium',
      dosage: '200-1,000 mcg daily',
      reason: 'May help improve insulin sensitivity, especially important with limited physical activity',
      foodSources: ['Whole grains', 'Broccoli', 'Green beans', 'Nuts']
    });
  }
  
  // Age-related recommendations for diabetics
  if (userData.age && userData.age > 50) {
    recommendations.push({
      name: 'Vitamin B12',
      dosage: '1,000 mcg daily',
      reason: 'Absorption decreases with age and is further reduced by common diabetes medications like metformin',
      foodSources: ['Beef', 'Liver', 'Clams', 'Eggs', 'Fortified cereals']
    });
    
    recommendations.push({
      name: 'Vitamin D',
      dosage: '1,000-2,000 IU daily',
      reason: 'Supports bone health and may help improve insulin sensitivity in older adults with diabetes',
      foodSources: ['Fatty fish', 'Egg yolks', 'Fortified foods']
    });
  }
  
  // Diet-based recommendations
  if (userData.dietType === 'vegan' || userData.dietType === 'vegetarian') {
    recommendations.push({
      name: 'Vitamin B12',
      dosage: '1,000 mcg daily',
      reason: 'Essential for vegans/vegetarians with diabetes as B12 is primarily in animal products and deficiency risk is higher with diabetes medications',
      foodSources: ['Nutritional yeast', 'Fortified plant milks', 'Fortified cereals']
    });
    
    recommendations.push({
      name: 'Omega-3 Fatty Acids',
      dosage: '1,000-2,000 mg daily',
      reason: 'May help reduce inflammation and improve insulin sensitivity for plant-based diabetics',
      foodSources: ['Flaxseeds', 'Chia seeds', 'Walnuts', 'Algae oil supplements']
    });
  }
  
  return recommendations;
};

// Generate drug interactions based on user medications
const checkDrugInteractions = (medications: Array<{name: string, dosage: string, frequency: string, timeOfDay: string, startDate?: string}>): DrugInteraction[] => {
  const interactions: DrugInteraction[] = [];
  
  if (!medications || medications.length < 2) return interactions;
  
  // Check each medication against every other medication
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const med1 = medications[i].name.toLowerCase();
      const med2 = medications[j].name.toLowerCase();
      
      // Check if there's an interaction in our database
      if (DRUG_INTERACTIONS_DB[med1] && DRUG_INTERACTIONS_DB[med1][med2]) {
        const interaction = DRUG_INTERACTIONS_DB[med1][med2];
        interactions.push({
          medication1: medications[i].name,
          medication2: medications[j].name,
          severity: interaction.severity,
          description: interaction.description
        });
      } 
      // Check in reverse order as well
      else if (DRUG_INTERACTIONS_DB[med2] && DRUG_INTERACTIONS_DB[med2][med1]) {
        const interaction = DRUG_INTERACTIONS_DB[med2][med1];
        interactions.push({
          medication1: medications[j].name,
          medication2: medications[i].name,
          severity: interaction.severity,
          description: interaction.description
        });
      }
    }
  }
  
  return interactions;
};

// Get vitamin recommendations based on medications
const getMedicationVitaminRecommendations = (medications: Array<{name: string, dosage: string, frequency: string, timeOfDay: string, startDate?: string}>): VitaminRecommendation[] => {
  const recommendations: VitaminRecommendation[] = [];
  
  if (!medications || medications.length === 0) return recommendations;
  
  medications.forEach(medication => {
    const medName = medication.name.toLowerCase();
    if (MEDICATION_VITAMIN_DEFICIENCIES[medName]) {
      MEDICATION_VITAMIN_DEFICIENCIES[medName].forEach(vitaminRec => {
        // Check if this vitamin is already in our recommendations
        const existingRec = recommendations.find(rec => rec.name === vitaminRec.vitamin);
        
        if (existingRec) {
          // If it's already recommended, just add this medication to the reasons
          existingRec.reason += `; Also needed for ${medication.name}: ${vitaminRec.reason}`;
          if (existingRec.interactingMedications) {
            existingRec.interactingMedications.push(medication.name);
          } else {
            existingRec.interactingMedications = [medication.name];
          }
        } else {
          // If it's not already recommended, add it to the list
          recommendations.push({
            name: vitaminRec.vitamin,
            dosage: vitaminRec.dosage,
            reason: `For ${medication.name}: ${vitaminRec.reason}`,
            foodSources: vitaminRec.foodSources,
            interactingMedications: [medication.name]
          });
        }
      });
    }
  });
  
  return recommendations;
};

// Main function to generate diabetes-specific health recommendations
export const generateHealthRecommendations = (userData: Partial<UserData>) => {
  // Start with diabetes-specific recommendations
  const basicRecommendations: Recommendation[] = [];
  
  // Glucose monitoring recommendations
  basicRecommendations.push({
    id: '1',
    title: 'Regular Glucose Monitoring',
    description: 'Track your blood glucose levels at consistent times each day to understand patterns and improve management.',
    category: 'medical',
    priority: 'high',
    icon: 'Activity'
  });
  
  // Add A1C monitoring recommendation
  basicRecommendations.push({
    id: '2',
    title: 'Schedule A1C Test',
    description: 'Aim for an A1C test every 3-6 months to monitor your long-term blood glucose control.',
    category: 'medical',
    priority: 'high',
    icon: 'Clipboard'
  });
  
  // Foot care recommendation
  basicRecommendations.push({
    id: '3',
    title: 'Daily Foot Care',
    description: 'Inspect your feet daily for cuts, blisters, redness, swelling, or nail problems to prevent complications.',
    category: 'preventive',
    priority: 'medium',
    icon: 'ShieldCheck'
  });
  
  // BMI calculation (if weight and height are available)
  if (userData.weight && userData.height) {
    const heightInMeters = userData.height / 100;
    const bmi = userData.weight / (heightInMeters * heightInMeters);
    
    if (bmi > 25) {
      basicRecommendations.push({
        id: '4',
        title: 'Weight Management',
        description: 'Your BMI indicates you may benefit from a weight management program. Even a modest 5-10% weight loss can significantly improve glucose control.',
        category: 'lifestyle',
        priority: 'medium',
        icon: 'Activity'
      });
    }
  }
  
  // Stress and working hours
  if (userData.workingHours && userData.workingHours > 50) {
    basicRecommendations.push({
      id: '5',
      title: 'Stress Management',
      description: 'High stress can raise blood glucose levels. Consider mindfulness practices or short breaks during your workday.',
      category: 'lifestyle',
      priority: 'medium',
      icon: 'Brain'
    });
  }
  
  // Sleep recommendations
  if (userData.sleepHours && (userData.sleepHours < 6 || userData.sleepHours > 9)) {
    basicRecommendations.push({
      id: '6',
      title: 'Sleep Optimization',
      description: `Poor sleep can affect glucose control. Aim for 7-8 hours of quality sleep. ${userData.sleepHours < 6 ? 'Consider establishing a regular sleep routine to improve glucose regulation.' : 'Too much sleep may indicate other health issues affecting your diabetes.'}`,
      category: 'lifestyle',
      priority: 'high',
      icon: 'Moon'
    });
  }
  
  // Exercise recommendations based on activity level
  if (userData.exerciseFrequency === 'sedentary' || userData.exerciseFrequency === 'lightly-active') {
    basicRecommendations.push({
      id: '7',
      title: 'Increase Physical Activity',
      description: 'Start with short 10-minute walks after meals to help lower post-meal glucose spikes. Aim to build up to 150 minutes of moderate activity weekly.',
      category: 'exercise',
      priority: 'high',
      icon: 'Dumbbell'
    });
  }
  
  // Diet recommendations
  if (userData.dietType === 'irregular' || !userData.dietType) {
    basicRecommendations.push({
      id: '8',
      title: 'Consistent Meal Schedule',
      description: 'Regular meal timing helps stabilize blood glucose. Aim for consistent carbohydrate intake at meals and establish regular eating patterns.',
      category: 'diet',
      priority: 'high',
      icon: 'Apple'
    });
  } else if (userData.dietType === 'high-carb') {
    basicRecommendations.push({
      id: '9',
      title: 'Carbohydrate Adjustment',
      description: 'Consider reducing refined carbohydrates and incorporating more fiber, protein, and healthy fats to stabilize blood glucose levels.',
      category: 'diet',
      priority: 'high',
      icon: 'Apple'
    });
  }
  
  // Eye examination recommendation
  basicRecommendations.push({
    id: '10',
    title: 'Annual Eye Examination',
    description: 'Schedule a comprehensive dilated eye exam at least once a year to check for diabetic retinopathy.',
    category: 'preventive',
    priority: 'medium',
    icon: 'Eye'
  });
  
  // Kidney function monitoring
  basicRecommendations.push({
    id: '11',
    title: 'Kidney Function Tests',
    description: 'Ensure you get urine and blood tests annually to monitor kidney function and detect early signs of diabetic nephropathy.',
    category: 'medical',
    priority: 'medium',
    icon: 'Activity'
  });
  
  // Hydration reminder
  basicRecommendations.push({
    id: '12',
    title: 'Hydration Habits',
    description: 'Proper hydration supports kidney function and helps maintain blood glucose levels. Aim for 8-10 glasses of water daily.',
    category: 'lifestyle',
    priority: 'medium',
    icon: 'Droplets'
  });
  
  // Medical alert recommendation
  basicRecommendations.push({
    id: '13',
    title: 'Medical Alert Identification',
    description: 'Consider wearing a medical ID bracelet or necklace that indicates you have diabetes in case of emergency.',
    category: 'preventive',
    priority: 'medium',
    icon: 'ShieldCheck'
  });
  
  // Supplement recommendations based on medications
  const medicationVitamins = userData.medications ? 
    getMedicationVitaminRecommendations(userData.medications) : [];
  
  // Supplement recommendations based on lifestyle and conditions
  const lifestyleVitamins = getLifestyleVitaminRecommendations(userData);
  
  // Check for drug interactions
  const drugInteractions = userData.medications ? 
    checkDrugInteractions(userData.medications) : [];
  
  // Merge vitamin recommendations, removing duplicates
  const vitaminRecommendations = [...medicationVitamins];
  
  lifestyleVitamins.forEach(lifeVitamin => {
    const existingIndex = vitaminRecommendations.findIndex(
      medVitamin => medVitamin.name === lifeVitamin.name
    );
    
    if (existingIndex >= 0) {
      // Combine reasons if the vitamin is already recommended
      vitaminRecommendations[existingIndex].reason += `; ${lifeVitamin.reason}`;
    } else {
      // Add if it's not already in the list
      vitaminRecommendations.push(lifeVitamin);
    }
  });
  
  return {
    recommendations: basicRecommendations,
    drugInteractions,
    vitaminRecommendations
  };
};
