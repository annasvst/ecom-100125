import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseTags(tagsString: string): string[] {
  return tagsString
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
    .map(tag => tag.toLowerCase())
}

export function validateDescription(description: string): string | null {
  if (!description || description.trim().length === 0) {
    return null; // Empty descriptions are handled by required attribute
  }

  // Check for multiple consecutive spaces
  if (/\s{2,}/.test(description)) {
    return 'Description must have only one space between words';
  }

  // Split into sentences by common sentence-ending punctuation (. ! ?)
  // Match sentences ending with . ! or ? followed by space or end of string
  const sentenceEndings = /[.!?]+(\s+|$)/g;
  const parts = description.split(sentenceEndings);
  const sentences: string[] = [];
  
  // Reconstruct sentences by pairing text with following punctuation/space
  for (let i = 0; i < parts.length; i += 2) {
    const text = parts[i]?.trim();
    if (text && text.length > 0) {
      sentences.push(text);
    }
  }
  
  // If no sentence endings found, treat entire description as one sentence
  if (sentences.length === 0) {
    sentences.push(description.trim());
  }
  
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    
    if (trimmed.length === 0) {
      continue;
    }
    
    // Check if sentence starts with a capital letter
    if (!/^[A-Z]/.test(trimmed)) {
      return 'Description must be in sentence case (first letter of each sentence must be capitalized)';
    }
    
    // Check that after the first letter, there are no uppercase letters
    // (excluding spaces and punctuation)
    if (trimmed.length > 1) {
      const afterFirstChar = trimmed.slice(1);
      // Remove spaces and common punctuation, then check for uppercase
      const lettersOnly = afterFirstChar.replace(/[\s.,!?;:'"-]/g, '');
      if (/[A-Z]/.test(lettersOnly)) {
        return 'Description must be in sentence case (only the first letter of each sentence should be capitalized)';
      }
    }
  }

  return null; // Validation passed
}
