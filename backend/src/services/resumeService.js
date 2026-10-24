const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const ApiError = require('../utils/errors');

/**
 * Standard Tech Skills Dictionary
 * Organized across common developer domains for automated keyword extraction.
 */
const TECH_DICTIONARY = [
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Golang', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL', 'HTML', 'CSS',
  // Frontend
  'React', 'Next.js', 'Angular', 'Vue.js', 'Vue', 'Redux', 'Tailwind CSS', 'Tailwind', 'Bootstrap', 'Webpack', 'Vite',
  // Backend & Runtime
  'Node.js', 'Express.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Spring', 'FastAPI', 'ASP.NET', 'NestJS',
  // Databases & Caching
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'Oracle', 'Cassandra', 'DynamoDB', 'Elasticsearch', 'Firebase',
  // Cloud & DevOps
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux', 'Git', 'GitHub', 'CI/CD', 'Jenkins', 'Nginx', 'Terraform',
  // Core CS Concepts & Architecture
  'Data Structures', 'Algorithms', 'System Design', 'REST API', 'GraphQL', 'Microservices', 'OOP', 'Object Oriented Programming',
  'Operating Systems', 'Computer Networks', 'DBMS', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Artificial Intelligence'
];

/**
 * Extract raw text from PDF or DOCX buffer.
 * 
 * Educational Notes for Students:
 * - PDF and DOCX files store binary representations of document trees.
 * - pdf-parse reads PDF text streams; mammoth extracts raw paragraphs from Word XML.
 * - If a document was scanned as an image without OCR, it will contain zero text streams.
 * 
 * @param {Buffer} buffer - In-memory file buffer from multer
 * @param {string} mimetype - MIME type of the uploaded file
 * @returns {Promise<string>} Cleaned extracted text
 */
async function extractText(buffer, mimetype) {
  if (!buffer || buffer.length === 0) {
    throw new ApiError(400, 'Uploaded file is empty.');
  }

  let text = '';

  try {
    if (mimetype === 'application/pdf') {
      // Handle both v1 and v2 API exports of pdf-parse
      if (typeof pdfParse !== 'function' && pdfParse.PDFParse) {
        const parser = new pdfParse.PDFParse({ data: buffer });
        const result = await parser.getText();
        await parser.destroy();
        text = result?.text || '';
      } else if (typeof pdfParse === 'function') {
        const data = await pdfParse(buffer);
        text = data?.text || '';
      } else {
        throw new Error('Unable to initialize PDF parser.');
      }
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result?.value || '';
    } else {
      throw new ApiError(400, 'Unsupported file format. Please upload a PDF or DOCX file.');
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(400, `Failed to parse document: ${err.message}`);
  }

  const trimmed = text.trim();
  if (!trimmed) {
    throw new ApiError(
      400,
      'The uploaded document contains no extractable text. Scanned images and empty documents are not supported.'
    );
  }

  return trimmed;
}

/**
 * Extract matched tech skills and domain keywords from resume text.
 * 
 * @param {string} text - Raw extracted resume text
 * @returns {string[]} De-duplicated array of keywords (capped at 30)
 */
function extractKeywords(text) {
  if (!text || typeof text !== 'string') return [];

  const lowerText = text.toLowerCase();
  const matched = new Set();

  // Match against predefined tech dictionary with word-boundary awareness
  for (const skill of TECH_DICTIONARY) {
    // Escape special characters like ++, #, . in regex
    const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
    if (regex.test(lowerText)) {
      matched.add(skill);
    }
  }

  // Detect project or academic phrases (e.g., "Full Stack", "Authentication", "Chatbot")
  const extraPatterns = [
    'Frontend', 'Backend', 'Full Stack', 'Web Development', 'Mobile App', 'Authentication',
    'Payment Gateway', 'API Integration', 'Unit Testing', 'Database Optimization'
  ];

  for (const extra of extraPatterns) {
    const escaped = extra.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');
    if (regex.test(lowerText)) {
      matched.add(extra);
    }
  }

  // Return up to 30 unique extracted keywords
  return Array.from(matched).slice(0, 30);
}

module.exports = {
  extractText,
  extractKeywords,
};

