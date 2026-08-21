
import React from 'react';
import { Pill, Leaf, Info, AlertTriangle } from 'lucide-react';
import { useUserData } from '@/context/UserDataContext';
import { Card } from '@/components/ui/card';

const VitaminRecommendations = () => {
  const { userData, vitaminRecommendations } = useUserData();
  
  // Generate age-based recommendations
  const getAgeBasedRecommendations = () => {
    const age = userData.age || 0;
    
    if (age < 30) {
      return [
        { name: "Vitamin D", dosage: "600-1000 IU daily", reason: "Supports bone health and immune function in young adults", foodSources: ["Fatty fish", "Egg yolks", "Fortified milk", "Sunlight exposure"] },
        { name: "Iron", dosage: "18mg daily (women), 8mg daily (men)", reason: "Essential for energy and focus in active young adults", foodSources: ["Red meat", "Spinach", "Lentils", "Fortified cereals"] },
      ];
    } else if (age < 50) {
      return [
        { name: "Vitamin D", dosage: "1000-2000 IU daily", reason: "Supports bone health and hormone regulation in middle age", foodSources: ["Fatty fish", "Egg yolks", "Fortified milk", "Sunlight exposure"] },
        { name: "Omega-3", dosage: "1000mg daily", reason: "Supports cardiovascular and cognitive health", foodSources: ["Fatty fish", "Walnuts", "Flaxseeds", "Chia seeds"] },
        { name: "CoQ10", dosage: "100-200mg daily", reason: "Supports cellular energy production as the body ages", foodSources: ["Organ meats", "Fatty fish", "Whole grains"] },
      ];
    } else {
      return [
        { name: "Vitamin D", dosage: "1000-2000 IU daily", reason: "Critical for bone health and immune function in older adults", foodSources: ["Fatty fish", "Egg yolks", "Fortified milk", "Sunlight exposure"] },
        { name: "Vitamin B12", dosage: "1000mcg daily", reason: "Absorption decreases with age; supports neurological function", foodSources: ["Meat", "Fish", "Dairy", "Fortified cereals"] },
        { name: "Calcium", dosage: "1200mg daily", reason: "Essential for bone health in aging adults", foodSources: ["Dairy products", "Leafy greens", "Fortified foods"] },
        { name: "CoQ10", dosage: "200-300mg daily", reason: "Supports heart health and energy production", foodSources: ["Organ meats", "Fatty fish", "Whole grains"] },
        { name: "Magnesium", dosage: "300-400mg daily", reason: "Supports muscle and nerve function", foodSources: ["Nuts", "Seeds", "Whole grains", "Leafy greens"] },
      ];
    }
  };
  
  // Generate recommendations based on exercise frequency
  const getExerciseBasedRecommendations = () => {
    const exerciseFrequency = userData.exerciseFrequency || "";
    
    if (exerciseFrequency === "frequent") {
      return [
        { name: "Magnesium", dosage: "350-450mg daily", reason: "Supports muscle recovery and prevents cramps", foodSources: ["Almonds", "Spinach", "Avocado", "Dark chocolate"] },
        { name: "Protein supplements", dosage: "0.8-1.2g per kg of body weight", reason: "Aids in muscle recovery and growth", foodSources: ["Lean meats", "Dairy", "Legumes", "Nuts and seeds"] },
        { name: "Electrolytes", dosage: "Varies based on activity level", reason: "Replaces minerals lost through sweat", foodSources: ["Bananas", "Coconut water", "Sports drinks"] },
      ];
    } else if (exerciseFrequency === "moderate") {
      return [
        { name: "Magnesium", dosage: "300-400mg daily", reason: "Supports muscle function and energy production", foodSources: ["Almonds", "Spinach", "Avocado", "Dark chocolate"] },
        { name: "Vitamin C", dosage: "90-500mg daily", reason: "Supports immune function and collagen production", foodSources: ["Citrus fruits", "Bell peppers", "Strawberries", "Broccoli"] },
      ];
    } else {
      return [
        { name: "Vitamin D", dosage: "1000-2000 IU daily", reason: "Supports bone health when physical activity is limited", foodSources: ["Fatty fish", "Egg yolks", "Fortified milk", "Sunlight exposure"] },
        { name: "B-Complex vitamins", dosage: "As directed on label", reason: "Supports energy metabolism and nervous system", foodSources: ["Whole grains", "Meat", "Eggs", "Legumes"] },
      ];
    }
  };
  
  // Generate diet-based recommendations
  const getDietBasedRecommendations = () => {
    const dietType = userData.dietType || "";
    
    if (dietType === "vegan" || dietType === "vegetarian") {
      return [
        { name: "Vitamin B12", dosage: "1000mcg daily", reason: "Not available in plant foods; essential for nerve function", foodSources: ["Nutritional yeast", "Fortified plant milks", "Supplements"] },
        { name: "Iron", dosage: "18mg daily", reason: "Plant-based iron is less bioavailable", foodSources: ["Lentils", "Spinach", "Fortified cereals", "Tofu"] },
        { name: "Zinc", dosage: "8-11mg daily", reason: "Lower availability in plant-based diets", foodSources: ["Legumes", "Nuts", "Seeds", "Whole grains"] },
        { name: "Omega-3 (DHA/EPA)", dosage: "250-500mg daily", reason: "Plant sources contain ALA which converts poorly to DHA/EPA", foodSources: ["Algae oil supplements", "Flaxseeds", "Walnuts", "Chia seeds"] },
      ];
    } else if (dietType === "low-carb" || dietType === "keto") {
      return [
        { name: "Magnesium", dosage: "300-400mg daily", reason: "Often depleted on low-carb diets", foodSources: ["Nuts", "Seeds", "Leafy greens", "Avocados"] },
        { name: "Potassium", dosage: "3500-4700mg daily", reason: "Helps maintain electrolyte balance", foodSources: ["Avocados", "Leafy greens", "Salmon", "Nuts"] },
        { name: "Fiber supplements", dosage: "5-10g daily", reason: "May be lacking in low-carb diets", foodSources: ["Chia seeds", "Flaxseeds", "Low-carb vegetables"] },
      ];
    } else {
      return [
        { name: "Multivitamin", dosage: "As directed on label", reason: "Fills potential gaps in a varied diet", foodSources: ["A balanced diet of fruits, vegetables, proteins, and whole grains"] },
      ];
    }
  };
  
  // Combine all recommendations
  const getAllRecommendations = () => {
    const ageRecs = getAgeBasedRecommendations();
    const exerciseRecs = getExerciseBasedRecommendations();
    const dietRecs = getDietBasedRecommendations();
    
    // Combine and deduplicate recommendations
    const combinedRecs = [...ageRecs, ...exerciseRecs, ...dietRecs];
    
    // Remove duplicates by vitamin name
    const uniqueRecs = combinedRecs.reduce((acc, current) => {
      const existingVitamin = acc.find(item => item.name === current.name);
      if (!existingVitamin) {
        return [...acc, current];
      }
      return acc;
    }, []);
    
    return uniqueRecs;
  };
  
  // Get all recommendations from context and generated ones
  const allRecommendations = [
    ...(vitaminRecommendations || []),
    ...getAllRecommendations()
  ];
  
  // Remove duplicates from combined recommendations
  const finalRecommendations = allRecommendations.reduce((acc, current) => {
    const existingVitamin = acc.find(item => item.name === current.name);
    if (!existingVitamin) {
      return [...acc, current];
    }
    return acc;
  }, []);
  
  if (!userData.age) {
    return (
      <div className="p-6 bg-white rounded-lg shadow mb-8 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
        <p className="text-gray-600 mb-4">To receive personalized vitamin recommendations, please complete your profile with age and health information.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold flex items-center">
          <Leaf className="mr-2 h-5 w-5 text-green-600" />
          Personalized Vitamin Recommendations
        </h3>
      </div>
      
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            These recommendations are based on your profile data. Always consult with a healthcare provider before starting any supplement regimen.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {finalRecommendations.map((vitamin, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 px-4 py-3 border-b">
              <h4 className="font-semibold text-gray-800 flex items-center">
                <Pill className="h-4 w-4 mr-2 text-green-600" />
                {vitamin.name}
              </h4>
              <p className="text-sm text-gray-600">{vitamin.dosage}</p>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-700 mb-3">
                <span className="font-medium">Why it's recommended:</span> {vitamin.reason}
              </p>
              
              <div className="mb-2">
                <h5 className="text-sm font-semibold text-gray-700 mb-1">
                  Food Sources:
                </h5>
                <ul className="list-disc pl-5 text-sm text-gray-600 grid grid-cols-2 gap-x-2">
                  {vitamin.foodSources.map((food, idx) => (
                    <li key={idx}>{food}</li>
                  ))}
                </ul>
              </div>
              
              {vitamin.interactingMedications && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-amber-700 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Interacts with: {vitamin.interactingMedications.join(', ')}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VitaminRecommendations;
