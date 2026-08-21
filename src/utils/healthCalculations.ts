
/**
 * Utility functions for health calculations
 */

/**
 * Calculate BMI based on height in cm and weight in kg
 */
export const calculateBMI = (height: number, weight: number): number => {
  // Convert height from cm to m
  const heightInMeters = height / 100;
  
  // Calculate BMI = weight (kg) / (height (m))^2
  const bmi = weight / (heightInMeters * heightInMeters);
  
  return bmi;
};

/**
 * Calculate health risk score based on assessment data
 * This is a simplified algorithm - in a real-world scenario this would be more complex
 * and based on clinical guidelines and validated risk models
 */
export interface HealthData {
  // Personal info
  age: number;
  gender: string;
  height: number;
  weight: number;
  
  // Health metrics
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  bloodSugar: number;
  
  // Lifestyle factors
  activityLevel: string;
  smokingStatus: string;
  alcoholConsumption: string;
  sleepHours: number;
  stressLevel: number;
  
  // Medical history
  familyHistoryDiabetes?: boolean;
  familyHistoryHeartDisease?: boolean;
  familyHistoryHypertension?: boolean;
  familyHistoryCancer?: boolean;
  hasDiabetes?: boolean;
  hasHeartDisease?: boolean;
  hasHypertension?: boolean;
  hasAsthma?: boolean;
  hasCancer?: boolean;
  
  // Additional factors can be added as needed
  [key: string]: any;
}

// Modified to handle potentially incomplete data
export const calculateHealthRisk = (data: Partial<HealthData>): number => {
  let riskScore = 0;
  
  // Calculate BMI and add to risk score if height and weight are available
  if (data.height && data.weight) {
    const bmi = calculateBMI(data.height, data.weight);
    if (bmi < 18.5) {
      riskScore += 1; // Underweight
    } else if (bmi >= 25 && bmi < 30) {
      riskScore += 1; // Overweight
    } else if (bmi >= 30 && bmi < 35) {
      riskScore += 2; // Obese class I
    } else if (bmi >= 35) {
      riskScore += 3; // Obese class II or higher
    }
  }
  
  // Age risk factor
  if (data.age) {
    if (data.age >= 40 && data.age < 50) {
      riskScore += 0.5;
    } else if (data.age >= 50 && data.age < 60) {
      riskScore += 1;
    } else if (data.age >= 60) {
      riskScore += 2;
    }
  }
  
  // Blood pressure risk factor
  if (data.bloodPressureSystolic && data.bloodPressureDiastolic) {
    if (data.bloodPressureSystolic >= 120 && data.bloodPressureSystolic < 130) {
      riskScore += 0.5; // Elevated
    } else if (data.bloodPressureSystolic >= 130 && data.bloodPressureSystolic < 140) {
      riskScore += 1; // Stage 1 hypertension
    } else if (data.bloodPressureSystolic >= 140 || data.bloodPressureDiastolic >= 90) {
      riskScore += 2; // Stage 2 hypertension
    }
  }
  
  // Blood sugar risk factor
  if (data.bloodSugar) {
    if (data.bloodSugar >= 100 && data.bloodSugar < 126) {
      riskScore += 1; // Prediabetes
    } else if (data.bloodSugar >= 126) {
      riskScore += 2; // Diabetes
    }
  }
  
  // Smoking status
  if (data.smokingStatus) {
    if (data.smokingStatus === 'former') {
      riskScore += 1;
    } else if (data.smokingStatus === 'current_light') {
      riskScore += 2;
    } else if (data.smokingStatus === 'current_heavy') {
      riskScore += 3;
    }
  }
  
  // Alcohol consumption
  if (data.alcoholConsumption) {
    if (data.alcoholConsumption === 'moderate') {
      riskScore += 0.5;
    } else if (data.alcoholConsumption === 'heavy') {
      riskScore += 1.5;
    }
  }
  
  // Physical activity - inverse relationship (less activity = higher risk)
  if (data.activityLevel) {
    if (data.activityLevel === 'sedentary') {
      riskScore += 2;
    } else if (data.activityLevel === 'lightly_active') {
      riskScore += 1;
    }
  }
  
  // Sleep risk factor
  if (data.sleepHours) {
    if (data.sleepHours < 6 || data.sleepHours > 9) {
      riskScore += 1;
    }
  }
  
  // Stress level
  if (data.stressLevel) {
    if (data.stressLevel >= 7 && data.stressLevel <= 8) {
      riskScore += 0.5;
    } else if (data.stressLevel > 8) {
      riskScore += 1;
    }
  }
  
  // Family history factors
  if (data.familyHistoryDiabetes) riskScore += 0.5;
  if (data.familyHistoryHeartDisease) riskScore += 0.5;
  if (data.familyHistoryHypertension) riskScore += 0.5;
  if (data.familyHistoryCancer) riskScore += 0.5;
  
  // Existing conditions
  if (data.hasDiabetes) riskScore += 2;
  if (data.hasHeartDisease) riskScore += 2;
  if (data.hasHypertension) riskScore += 1;
  if (data.hasAsthma) riskScore += 0.5;
  if (data.hasCancer) riskScore += 2;
  
  // Ensure score stays within 0-10 range
  riskScore = Math.min(Math.max(Math.round(riskScore), 0), 10);
  
  return riskScore;
};
