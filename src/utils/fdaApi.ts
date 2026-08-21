
/**
 * Utility functions for interacting with the FDA API
 */

export interface FdaDrug {
  brandName: string;
  genericName?: string;
  activeIngredients?: string[];
  indications?: string;
  warnings?: string[];
  interactions?: string[];
}

/**
 * Searches for drugs in the FDA database matching the query
 * @param query The search term
 * @param limit Maximum number of results to return
 * @returns Array of drug information
 */
export async function searchDrugs(query: string, limit: number = 15): Promise<FdaDrug[]> {
  if (!query || query.length < 2) return [];
  
  try {
    // URL encode the search query
    const encodedQuery = encodeURIComponent(query.toLowerCase());
    const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${encodedQuery}&limit=${limit}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        // No results found
        return [];
      }
      throw new Error(`FDA API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    
    // Extract and format the drug information
    const drugs: FdaDrug[] = data.results
      .filter((item: any) => item.openfda && item.openfda.brand_name)
      .map((item: any) => {
        return {
          brandName: item.openfda.brand_name[0] || "Unknown",
          genericName: item.openfda.generic_name?.[0],
          activeIngredients: item.openfda.substance_name,
          indications: item.indications_and_usage?.[0],
          warnings: item.warnings || item.warnings_and_precautions,
          interactions: item.drug_interactions
        };
      });
    
    return drugs;
  } catch (error) {
    console.error("Error fetching drug names:", error);
    return [];
  }
}

/**
 * Checks for potential drug interactions between two medications
 * @param drug1 First drug name
 * @param drug2 Second drug name
 * @returns Information about potential interactions
 */
export async function checkDrugInteractions(drug1: string, drug2: string): Promise<{ 
  hasInteraction: boolean;
  severity?: 'high' | 'medium' | 'low';
  description?: string;
}> {
  // This is a placeholder for a real drug interaction API
  // In a production environment, you would connect to a more comprehensive
  // drug interaction database like RxNav, First Databank, or Micromedex
  
  const commonInteractions: Record<string, Record<string, { 
    severity: 'high' | 'medium' | 'low', 
    description: string 
  }>> = {
    'lisinopril': {
      'potassium': {
        severity: 'high',
        description: 'Combining potassium supplements with ACE inhibitors like lisinopril can cause dangerous increases in blood potassium levels.'
      },
      'ibuprofen': {
        severity: 'medium',
        description: 'NSAIDs like ibuprofen may reduce the blood pressure-lowering effects of lisinopril and increase kidney damage risk.'
      }
    },
    'warfarin': {
      'aspirin': {
        severity: 'high',
        description: 'Combining warfarin with aspirin significantly increases bleeding risk.'
      },
      'ibuprofen': {
        severity: 'high',
        description: 'NSAIDs like ibuprofen can increase the risk of serious bleeding when taken with warfarin.'
      }
    },
    'simvastatin': {
      'grapefruit': {
        severity: 'medium',
        description: 'Grapefruit juice can increase simvastatin levels in your blood, raising the risk of muscle breakdown.'
      }
    },
    'metformin': {
      'alcohol': {
        severity: 'medium',
        description: 'Alcohol can interact with metformin and increase the risk of lactic acidosis.'
      }
    }
  };
  
  // Normalize drug names for comparison
  const normDrug1 = drug1.toLowerCase().trim();
  const normDrug2 = drug2.toLowerCase().trim();
  
  // Check interactions in both directions
  if (commonInteractions[normDrug1] && commonInteractions[normDrug1][normDrug2]) {
    return {
      hasInteraction: true,
      ...commonInteractions[normDrug1][normDrug2]
    };
  } else if (commonInteractions[normDrug2] && commonInteractions[normDrug2][normDrug1]) {
    return {
      hasInteraction: true,
      ...commonInteractions[normDrug2][normDrug1]
    };
  }
  
  // No known interaction found
  return {
    hasInteraction: false,
    description: "No known interactions found between these medications. Always consult with a healthcare professional."
  };
}

/**
 * Gets detailed information about a specific drug
 * @param drugName The name of the drug to look up
 * @returns Detailed drug information
 */
export async function getDrugDetails(drugName: string): Promise<FdaDrug | null> {
  if (!drugName) return null;
  
  try {
    const encodedName = encodeURIComponent(drugName.toLowerCase());
    const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name.exact:"${encodedName}"&limit=1`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`FDA API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return null;
    }
    
    const drug = data.results[0];
    
    return {
      brandName: drug.openfda?.brand_name?.[0] || drugName,
      genericName: drug.openfda?.generic_name?.[0],
      activeIngredients: drug.openfda?.substance_name,
      indications: drug.indications_and_usage?.[0],
      warnings: drug.warnings || drug.warnings_and_precautions,
      interactions: drug.drug_interactions
    };
  } catch (error) {
    console.error("Error fetching drug details:", error);
    return null;
  }
}
