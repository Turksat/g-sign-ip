from dataclasses import dataclass
from typing import Optional

@dataclass
class PatentDocument:
    publication_number: str
    family_id: str
    country_code: str
    publication_date: str
    filing_date: str
    grant_date: str
    priority_date: str
    title: str
    abstract: str
    claims: str
    description: str
    inventors: str
    assignees: str
    cpc_codes: str
    ipc_codes: str
    citations: str

    def get_searchable_text(self) -> str:
        return f"{self.title}. {self.abstract}. {self.claims}"

    def get_full_text(self) -> str:
        return f"{self.title}. {self.abstract}. {self.claims}. {self.description}"
    
    def get_publication_year(self) -> Optional[int]:
        try:
            # Handle various date formats (YYYY-MM-DD, YYYY, etc.)
            if self.publication_date and self.publication_date != '0':
                year_str = self.publication_date.split('-')[0]
                return int(year_str) if year_str.isdigit() and len(year_str) == 4 else None
        except (ValueError, AttributeError):
            pass
        return None
    
    def get_filing_year(self) -> Optional[int]:
        try:
            if self.filing_date and self.filing_date != '0':
                year_str = self.filing_date.split('-')[0]
                return int(year_str) if year_str.isdigit() and len(year_str) == 4 else None
        except (ValueError, AttributeError):
            pass
        return None
    
    def is_granted(self) -> bool:
        return self.grant_date and self.grant_date != '0' and self.grant_date.strip()
    
    def get_priority_year(self) -> Optional[int]:
        try:
            if self.priority_date and self.priority_date != '0':
                year_str = self.priority_date.split('-')[0]
                return int(year_str) if year_str.isdigit() and len(year_str) == 4 else None
        except (ValueError, AttributeError):
            pass
        return None
    
    def get_metadata_summary(self) -> str:
        parts = []
        if self.country_code:
            parts.append(f"Country: {self.country_code}")
        if year := self.get_filing_year():
            parts.append(f"Filed: {year}")
        if self.is_granted():
            parts.append("Status: Granted")
        else:
            parts.append("Status: Not Granted")
        return " | ".join(parts)
