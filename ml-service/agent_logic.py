from google import genai
import os
import json

# Setup the modern Gemini Client
api_key = os.environ.get("AIzaSyAznj6KI8oPIqyfTV3pYoESQaExiuw36FE")

if not api_key:
    print("⚠️ WARNING: GEMINI_API_KEY not found in environment. Agentic reasoning will be disabled.")

class LegalDetective:
    def __init__(self, paper_data, gov_data, physical_data):
        """
        Initializes the detective with three sources of truth.
        paper_data: Text extracted via OCR/RAG
        gov_data: Record found in land_parcels.json via ULPIN
        physical_data: Calculated area from GPS coordinates
        """
        self.paper_data = paper_data
        self.gov_data = gov_data
        self.physical_data = physical_data
        self.client = genai.Client(api_key=api_key) if api_key else None

    def generate_verdict(self):
        if not self.client:
            return json.dumps({
                "verdict": "ERROR", 
                "reasoning": "Gemini API Key missing. Please set GEMINI_API_KEY."
            })

        # The prompt for the Triple-Check Logic
        prompt = f"""
        You are the Sthir Labs Legal Detective. Your goal is to find discrepancies by comparing three sources:
        
        1. OLD PAPER RECORDS (OCR): {json.dumps(self.paper_data)}
        2. GOVT DATABASE (ULPIN): {json.dumps(self.gov_data)}
        3. PHYSICAL SURVEY (SATELLITE): {json.dumps(self.physical_data)}
        
        INSTRUCTIONS:
        - Check if the 'Area' (Acres) is consistent across all three.
        - Verify if the Owner Name in the paper matches or is a logical variation of the database record.
        - If Physical Area < Govt Area, flag as 'POTENTIAL_ENCROACHMENT'.
        - If Govt Area != Paper Area, flag as 'RECORD_MISMATCH'.
        
        Output EXACTLY in this JSON format:
        {{
            "verdict": "CLEAN" | "DISCREPANCY" | "LITIGATED",
            "reasoning": "A detailed explanation of the mismatches found.",
            "gaps": ["List of specific issues, e.g., 'Area mismatch of 0.5 acres'"]
        }}
        """

        try:
            # Generate the reasoning response using Gemini 2.0 Flash
            response = self.client.models.generate_content(
                model="gemini-2.0-flash", 
                contents=prompt
            )
            
            # Clean the output in case Gemini returns markdown blocks
            raw_text = response.text.strip()
            if "```json" in raw_text:
                raw_text = raw_text.split("```json")[1].split("```")[0].strip()
            elif "```" in raw_text:
                raw_text = raw_text.split("```")[1].strip()
            
            return raw_text
        except Exception as e:
            return json.dumps({
                "verdict": "ERROR", 
                "reasoning": f"AI Generation failed: {str(e)}",
                "gaps": []
            })
    