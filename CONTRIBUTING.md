# Contributing to Awesome Financial Freedom

Thanks for your interest in contributing! This project aims to build the most comprehensive, AI-ready knowledge base for financial freedom.

## Ways to Contribute

1. **Add a new knowledge node** (see JSON schema below)
2. **Improve an existing node** (fix errors, add examples, update sources)
3. **Translate nodes** to other languages
4. **Improve the AI Skill prompts**
5. **Add book summaries** to `/docs/book-summaries`

## Knowledge Node JSON Schema

All knowledge nodes must follow this structure:

```json
{
  "id": "unique-kebab-case-id",
  "title": "Human readable title",
  "chapter": "01-mindset|02-foundation|03-accumulation|04-allocation|05-automation|06-freedom",
  "tags": ["tag1", "tag2"],
  "question_patterns": ["What users might ask", "Alternative phrasings"],
  "answer": {
    "summary": "One-sentence TL;DR",
    "core_concept": "Detailed explanation",
    "formula": "Optional: mathematical formula",
    "example": {
      "scenario": "Specific scenario",
      "calculation": "Step-by-step math",
      "explanation": "What the result means"
    },
    "limitations": ["Important caveat 1", "Important caveat 2"]
  },
  "action_item": "A concrete, immediate next step for the user",
  "related_nodes": ["other-node-id-1", "other-node-id-2"],
  "source": {
    "primary": "Primary source citation",
    "books": ["Book 1, Chapter X", "Book 2, Chapter Y"]
  }
}
