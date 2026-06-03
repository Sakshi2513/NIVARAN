from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy
import re

app = FastAPI(title='Nivaran NLP Service')

class AnalyzeRequest(BaseModel):
    title: str
    description: str

class AnalyzeResponse(BaseModel):
    category: str
    keywords: list[str]
    severityScore: int
    severityLevel: str
    sentiment: str
    department: str
    duplicate: bool
    duplicateId: str | None = None

nlp = spacy.load('en_core_web_sm')

existing_titles: list[str] = [
    'Water supply not working in ward 12',
    'Broken street light near park',
    'Garbage collection delayed for days',
    'Dangerous pothole on main road'
]

CATEGORY_MAP = {
    'Roads': ['pothole', 'road', 'traffic', 'street', 'streetlight', 'signal'],
    'Water': ['water', 'leakage', 'tap', 'supply', 'pipeline', 'drinking'],
    'Electricity': ['electric', 'power', 'electricity', 'shock', 'meter', 'billing'],
    'Garbage': ['garbage', 'trash', 'waste', 'bin', 'dump'],
    'Drainage': ['drain', 'drainage', 'sewage', 'waterlogging'],
    'Corruption': ['corruption', 'bribe', 'fraud', 'bribery'],
    'Street Lights': ['street light', 'lighting', 'lamp'],
    'Women Safety': ['harassment', 'women', 'unsafe', 'violence'],
    'Pollution': ['pollution', 'smoke', 'dirty', 'air', 'water pollution'],
    'Transport': ['transport', 'bus', 'metro', 'traffic'],
    'Health': ['health', 'hospital', 'clinic', 'medicine'],
    'Education': ['school', 'education', 'teacher', 'class']
}

DEPARTMENT_MAP = {
    'Roads': 'Public Works',
    'Water': 'Water Management',
    'Electricity': 'Power Department',
    'Garbage': 'Sanitation',
    'Drainage': 'Public Works',
    'Corruption': 'Anti Corruption',
    'Street Lights': 'Public Works',
    'Women Safety': 'Public Safety',
    'Pollution': 'Environment',
    'Transport': 'Transport',
    'Health': 'Health',
    'Education': 'Education',
    'Other': 'General Services'
}

HIGH_PRIORITY = ['death', 'accident', 'danger', 'no water', 'electric shock', 'harassment', 'corruption', 'violence', 'emergency', 'unsafe', 'fire']
MEDIUM_PRIORITY = ['broken', 'leakage', 'dirty', 'damaged', 'delay']
LOW_PRIORITY = ['request', 'suggestion', 'improvement']


def normalize_text(text: str) -> str:
    return re.sub(r'[^a-z0-9 ]+', ' ', text.lower()).strip()


def category_for_text(text: str) -> str:
    normalized = normalize_text(text)
    for category, terms in CATEGORY_MAP.items():
        for term in terms:
            if term in normalized:
                return category
    return 'Other'


def severity_metrics(text: str) -> tuple[int, str]:
    normalized = normalize_text(text)
    score = 0

    for phrase in HIGH_PRIORITY:
        if phrase in normalized:
            score += 30
    for phrase in MEDIUM_PRIORITY:
        if phrase in normalized:
            score += 15
    for phrase in LOW_PRIORITY:
        if phrase in normalized:
            score += 5

    score += min(len(normalized.split()), 100)
    score = min(score, 100)

    if score > 80:
        level = 'Critical'
    elif score > 60:
        level = 'High'
    elif score > 30:
        level = 'Medium'
    else:
        level = 'Low'

    return score, level


def sentiment_of_text(text: str) -> str:
    normalized = normalize_text(text)
    if any(word in normalized for word in HIGH_PRIORITY):
        return 'Negative'
    if any(word in normalized for word in MEDIUM_PRIORITY):
        return 'Neutral'
    return 'Positive'


def extract_keywords(text: str) -> list[str]:
    doc = nlp(text)
    keywords = {chunk.text.lower() for chunk in doc.noun_chunks if len(chunk.text) > 2}
    entities = {ent.text.lower() for ent in doc.ents if len(ent.text) > 2}
    return list({*keywords, *entities})[:8]


def detect_duplicate(title: str) -> tuple[bool, str | None]:
    if not existing_titles:
        return False, None

    corpus = existing_titles + [title]
    vectorizer = TfidfVectorizer().fit_transform(corpus)
    similarity = cosine_similarity(vectorizer[-1:], vectorizer[:-1])[0]
    best_index = int(similarity.argmax())
    if similarity[best_index] > 0.75:
        return True, existing_titles[best_index]
    return False, None


@app.get('/health')
def health():
    return {'status': 'ok', 'service': 'nlp-service'}


@app.post('/analyze', response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    text = f"{request.title}. {request.description}"
    category = category_for_text(text)
    severityScore, severityLevel = severity_metrics(text)
    sentiment = sentiment_of_text(text)
    department = DEPARTMENT_MAP.get(category, 'General Services')
    keywords = extract_keywords(text)
    duplicate, duplicate_id = detect_duplicate(request.title)

    if duplicate:
        existing_titles.append(request.title)

    return AnalyzeResponse(
        category=category,
        keywords=keywords,
        severityScore=severityScore,
        severityLevel=severityLevel,
        sentiment=sentiment,
        department=department,
        duplicate=duplicate,
        duplicateId=duplicate_id
    )
