#!/usr/bin/env node

/**
 * Seed Script for Hierarchical Course Content
 * 
 * This script creates a sample course with hierarchical structure:
 * - Course: "Complete Web Development Mastery"
 * - Modules with Lessons
 * - Lessons with Topics
 * - Topics with Sub-topics
 * - Sub-topics with rich content and exercises
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding hierarchical course content...\n')

  try {
    // 1. Create Course Category
    console.log('1️⃣ Creating course category...')
    const category = await prisma.courseCategory.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: {
        slug: 'web-development',
        name: 'Web Development',
        description: 'Learn modern web development from scratch',
        order: 1
      }
    })
    console.log('   ✅ Category created:', category.name)

    // 2. Create Course
    console.log('\n2️⃣ Creating sample course...')
    const course = await prisma.course.upsert({
      where: { slug: 'complete-web-development-mastery' },
      update: {},
      create: {
        slug: 'complete-web-development-mastery',
        title: 'Complete Web Development Mastery',
        description: 'Master modern web development with HTML, CSS, JavaScript, and React. Build real-world projects and learn industry best practices.',
        thumbnail: '/course-thumbnails/web-dev-mastery.jpg',
        level: 'Beginner to Advanced',
        duration: '40 hours',
        price: 0, // Free course
        status: 'PUBLISHED',
        publishedAt: new Date(),
        categoryId: category.id,
        metadata: {
          features: ['Hands-on Projects', 'Interactive Exercises', 'Video Lessons', 'Code Examples'],
          prerequisites: ['Basic computer skills', 'Willingness to learn'],
          outcomes: ['Build responsive websites', 'Create interactive web applications', 'Deploy projects to production']
        }
      }
    })
    console.log('   ✅ Course created:', course.title)

    // 3. Create Modules
    console.log('\n3️⃣ Creating course modules...')
    const modules = [
      {
        slug: 'html-fundamentals',
        title: 'HTML Fundamentals',
        description: 'Learn the building blocks of web pages with HTML',
        order: 0
      },
      {
        slug: 'css-styling',
        title: 'CSS Styling & Layout',
        description: 'Style your web pages and create beautiful layouts',
        order: 1
      },
      {
        slug: 'javascript-basics',
        title: 'JavaScript Fundamentals',
        description: 'Add interactivity to your web pages with JavaScript',
        order: 2
      },
      {
        slug: 'responsive-design',
        title: 'Responsive Web Design',
        description: 'Create websites that work on all devices',
        order: 3
      }
    ]

    const createdModules = []
    for (const moduleData of modules) {
      const module = await prisma.module.upsert({
        where: { 
          courseId_slug: {
            courseId: course.id,
            slug: moduleData.slug
          }
        },
        update: {},
        create: {
          ...moduleData,
          courseId: course.id
        }
      })
      createdModules.push(module)
      console.log(`   ✅ Module created: ${module.title}`)
    }

    // 4. Create Lessons with Hierarchical Structure
    console.log('\n4️⃣ Creating lessons with hierarchical structure...')

    // HTML Fundamentals Module Lessons
    const htmlLesson = await prisma.lesson.upsert({
      where: { slug: 'html-structure-and-elements' },
      update: {},
      create: {
        slug: 'html-structure-and-elements',
        title: 'HTML Structure and Elements',
        description: 'Learn the fundamental structure of HTML documents and essential elements',
        courseId: course.id,
        moduleId: createdModules[0].id,
        order: 0,
        estimatedMinutes: 45,
        difficulty: 'Beginner',
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    })
    console.log(`   ✅ Lesson created: ${htmlLesson.title}`)

    // 5. Create Topics for HTML Lesson
    console.log('\n5️⃣ Creating topics and sub-topics...')

    // Topic 1: HTML Document Structure
    const topic1 = await prisma.lessonTopic.create({
      data: {
        lessonId: htmlLesson.id,
        title: 'HTML Document Structure',
        description: 'Understanding the basic structure of HTML documents',
        order: 0,
        estimatedMinutes: 15
      }
    })

    // Sub-topics for Topic 1
    const subtopic1_1 = await prisma.lessonSubtopic.create({
      data: {
        topicId: topic1.id,
        title: 'DOCTYPE Declaration',
        description: 'Learn about the HTML5 DOCTYPE declaration',
        order: 0,
        estimatedMinutes: 5
      }
    })

    // Content for Sub-topic 1.1
    await prisma.subtopicContent.create({
      data: {
        subtopicId: subtopic1_1.id,
        type: 'reading',
        theory: `
          <h3>Understanding DOCTYPE Declaration</h3>
          <p>The DOCTYPE declaration is the first line in an HTML document and tells the browser which version of HTML the page is written in.</p>
          
          <h4>HTML5 DOCTYPE</h4>
          <p>HTML5 uses a simple DOCTYPE declaration:</p>
          <pre><code>&lt;!DOCTYPE html&gt;</code></pre>
          
          <h4>Why is DOCTYPE Important?</h4>
          <ul>
            <li><strong>Standards Mode:</strong> Ensures the browser renders the page in standards-compliant mode</li>
            <li><strong>Consistency:</strong> Provides consistent rendering across different browsers</li>
            <li><strong>Validation:</strong> Required for HTML validation</li>
          </ul>
          
          <h4>Best Practices</h4>
          <p>Always include the DOCTYPE declaration as the very first line of your HTML document, before the &lt;html&gt; tag.</p>
        `,
        codeExample: {
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First HTML Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first HTML page with proper DOCTYPE declaration.</p>
</body>
</html>`,
          css: `/* Basic styling for the HTML structure */
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    max-width: 600px;
    margin: 0 auto;
}`,
          js: `// JavaScript to demonstrate DOM interaction
document.addEventListener('DOMContentLoaded', function() {
    console.log('HTML document loaded successfully!');
    
    // Add click event to heading
    const heading = document.querySelector('h1');
    heading.addEventListener('click', function() {
        this.style.color = this.style.color === 'red' ? '#333' : 'red';
    });
});`
        }
      }
    })

    // Exercise for Sub-topic 1.1
    await prisma.subtopicExercise.create({
      data: {
        subtopicId: subtopic1_1.id,
        title: 'Create Your First HTML Document',
        description: 'Create a basic HTML document with proper DOCTYPE declaration and document structure',
        starterCode: {
          html: `<!-- Add the DOCTYPE declaration here -->

<!-- Create the HTML structure with:
     - html element with lang attribute
     - head section with meta tags and title
     - body section with heading and paragraph -->`,
          css: `/* Add some basic styling */
body {
    font-family: Arial, sans-serif;
    margin: 20px;
}`,
          js: `// Add JavaScript to make the page interactive
console.log('Ready to code!');`
        },
        solution: {
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First HTML Document</title>
</head>
<body>
    <h1>Welcome to HTML!</h1>
    <p>This is my first properly structured HTML document.</p>
</body>
</html>`,
          css: `body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background-color: #f9f9f9;
}

h1 {
    color: #2c3e50;
    text-align: center;
}

p {
    color: #34495e;
    line-height: 1.6;
}`,
          js: `console.log('HTML document created successfully!');

document.addEventListener('DOMContentLoaded', function() {
    const heading = document.querySelector('h1');
    heading.style.cursor = 'pointer';
    
    heading.addEventListener('click', function() {
        alert('Great job creating your first HTML document!');
    });
});`
        },
        hints: [
          'Start with <!DOCTYPE html> as the very first line',
          'Use <html lang="en"> to specify the language',
          'Include charset and viewport meta tags in the head',
          'Add a meaningful title for your page'
        ],
        order: 0
      }
    })

    // Sub-topic 1.2: HTML Element
    const subtopic1_2 = await prisma.lessonSubtopic.create({
      data: {
        topicId: topic1.id,
        title: 'HTML Root Element',
        description: 'Understanding the HTML root element and its attributes',
        order: 1,
        estimatedMinutes: 5
      }
    })

    await prisma.subtopicContent.create({
      data: {
        subtopicId: subtopic1_2.id,
        type: 'reading',
        theory: `
          <h3>The HTML Root Element</h3>
          <p>The &lt;html&gt; element is the root element of an HTML document. It wraps all content on the page and should include the lang attribute.</p>
          
          <h4>Language Attribute</h4>
          <p>The <code>lang</code> attribute specifies the language of the document:</p>
          <pre><code>&lt;html lang="en"&gt;</code></pre>
          
          <h4>Benefits of Language Declaration</h4>
          <ul>
            <li><strong>Accessibility:</strong> Screen readers can pronounce content correctly</li>
            <li><strong>SEO:</strong> Search engines understand the content language</li>
            <li><strong>Translation:</strong> Browsers can offer translation services</li>
          </ul>
        `,
        codeExample: {
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML Root Element Example</title>
</head>
<body>
    <h1>Understanding the HTML Element</h1>
    <p>This page demonstrates the proper use of the HTML root element.</p>
</body>
</html>`
        }
      }
    })

    // Topic 2: Essential HTML Elements
    const topic2 = await prisma.lessonTopic.create({
      data: {
        lessonId: htmlLesson.id,
        title: 'Essential HTML Elements',
        description: 'Learn about the most important HTML elements for content structure',
        order: 1,
        estimatedMinutes: 20
      }
    })

    // Sub-topic 2.1: Headings and Paragraphs
    const subtopic2_1 = await prisma.lessonSubtopic.create({
      data: {
        topicId: topic2.id,
        title: 'Headings and Paragraphs',
        description: 'Master the use of heading and paragraph elements',
        order: 0,
        estimatedMinutes: 8
      }
    })

    await prisma.subtopicContent.create({
      data: {
        subtopicId: subtopic2_1.id,
        type: 'reading',
        theory: `
          <h3>HTML Headings and Paragraphs</h3>
          <p>Headings and paragraphs are the foundation of content structure in HTML.</p>
          
          <h4>Heading Elements (h1-h6)</h4>
          <p>HTML provides six levels of headings, from h1 (most important) to h6 (least important):</p>
          <ul>
            <li><strong>h1:</strong> Main page title (use only once per page)</li>
            <li><strong>h2:</strong> Major section headings</li>
            <li><strong>h3-h6:</strong> Subsection headings</li>
          </ul>
          
          <h4>Paragraph Element</h4>
          <p>The &lt;p&gt; element represents a paragraph of text and automatically adds spacing before and after.</p>
          
          <h4>Best Practices</h4>
          <ul>
            <li>Use headings in hierarchical order (don't skip levels)</li>
            <li>Keep paragraphs focused on a single idea</li>
            <li>Use semantic meaning, not visual appearance</li>
          </ul>
        `,
        codeExample: {
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Headings and Paragraphs</title>
</head>
<body>
    <h1>Web Development Guide</h1>
    
    <h2>Getting Started</h2>
    <p>Web development is the process of creating websites and web applications. It involves both front-end and back-end development.</p>
    
    <h3>Front-end Development</h3>
    <p>Front-end development focuses on the user interface and user experience. It uses HTML, CSS, and JavaScript.</p>
    
    <h3>Back-end Development</h3>
    <p>Back-end development handles server-side logic, databases, and application architecture.</p>
    
    <h2>Learning Path</h2>
    <p>Start with HTML to structure content, then learn CSS for styling, and finally JavaScript for interactivity.</p>
</body>
</html>`,
          css: `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    color: #333;
}

h1 {
    color: #2c3e50;
    border-bottom: 3px solid #3498db;
    padding-bottom: 10px;
}

h2 {
    color: #34495e;
    margin-top: 30px;
}

h3 {
    color: #7f8c8d;
}

p {
    margin-bottom: 15px;
    text-align: justify;
}`
        }
      }
    })

    // Exercise for headings and paragraphs
    await prisma.subtopicExercise.create({
      data: {
        subtopicId: subtopic2_1.id,
        title: 'Create a Blog Post Structure',
        description: 'Create a well-structured blog post using proper heading hierarchy and paragraphs',
        starterCode: {
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Blog Post</title>
</head>
<body>
    <!-- Create a blog post about "Learning Web Development" with:
         - Main title (h1)
         - Introduction paragraph
         - Section about HTML (h2) with paragraph
         - Subsection about HTML elements (h3) with paragraph
         - Section about CSS (h2) with paragraph
         - Conclusion paragraph -->
</body>
</html>`,
          css: `/* Style your blog post */
body {
    font-family: Arial, sans-serif;
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
}`
        },
        solution: {
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Learning Web Development - My Blog</title>
</head>
<body>
    <h1>Learning Web Development: A Beginner's Journey</h1>
    
    <p>Starting to learn web development can feel overwhelming, but with the right approach and dedication, anyone can master the fundamentals and build amazing websites.</p>
    
    <h2>Understanding HTML</h2>
    <p>HTML (HyperText Markup Language) is the backbone of every website. It provides the structure and content that browsers can understand and display to users.</p>
    
    <h3>Essential HTML Elements</h3>
    <p>Learning the most important HTML elements like headings, paragraphs, links, and images will give you a solid foundation for creating web content.</p>
    
    <h2>Styling with CSS</h2>
    <p>CSS (Cascading Style Sheets) transforms plain HTML into visually appealing websites. It controls colors, fonts, layouts, and responsive design.</p>
    
    <p>The journey of learning web development is rewarding and opens up countless opportunities in the digital world. Take it one step at a time and practice regularly!</p>
</body>
</html>`,
          css: `body {
    font-family: 'Georgia', serif;
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
    line-height: 1.8;
    color: #2c3e50;
}

h1 {
    color: #e74c3c;
    text-align: center;
    margin-bottom: 30px;
    font-size: 2.2em;
}

h2 {
    color: #3498db;
    border-left: 4px solid #3498db;
    padding-left: 15px;
    margin-top: 35px;
}

h3 {
    color: #27ae60;
    font-style: italic;
}

p {
    margin-bottom: 20px;
    text-align: justify;
}`
        },
        hints: [
          'Use h1 for the main blog post title',
          'Use h2 for major sections (HTML, CSS)',
          'Use h3 for subsections under major topics',
          'Write meaningful paragraphs for each section',
          'Maintain proper heading hierarchy'
        ],
        order: 0
      }
    })

    // Topic 3: HTML Attributes and Links
    const topic3 = await prisma.lessonTopic.create({
      data: {
        lessonId: htmlLesson.id,
        title: 'HTML Attributes and Links',
        description: 'Learn about HTML attributes and creating links between pages',
        order: 2,
        estimatedMinutes: 10
      }
    })

    // Sub-topic 3.1: Understanding Attributes
    const subtopic3_1 = await prisma.lessonSubtopic.create({
      data: {
        topicId: topic3.id,
        title: 'HTML Attributes',
        description: 'Understanding how HTML attributes work and common attributes',
        order: 0,
        estimatedMinutes: 5
      }
    })

    await prisma.subtopicContent.create({
      data: {
        subtopicId: subtopic3_1.id,
        type: 'video',
        theory: `
          <h3>HTML Attributes</h3>
          <p>HTML attributes provide additional information about HTML elements. They are always specified in the opening tag and come in name/value pairs.</p>
          
          <h4>Common Attributes</h4>
          <ul>
            <li><strong>id:</strong> Unique identifier for an element</li>
            <li><strong>class:</strong> CSS class name for styling</li>
            <li><strong>src:</strong> Source URL for images and media</li>
            <li><strong>href:</strong> Destination URL for links</li>
            <li><strong>alt:</strong> Alternative text for images</li>
            <li><strong>title:</strong> Tooltip text</li>
          </ul>
          
          <h4>Attribute Syntax</h4>
          <p>Attributes follow this pattern: <code>attribute="value"</code></p>
        `,
        youtubeId: 'dQw4w9WgXcQ', // Sample YouTube ID (Rick Roll for demo)
        duration: '8:30',
        codeExample: {
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>HTML Attributes Example</title>
</head>
<body>
    <h1 id="main-title" class="heading">HTML Attributes Demo</h1>
    
    <p class="intro" title="This is a tooltip">
        This paragraph demonstrates various HTML attributes.
    </p>
    
    <img src="https://via.placeholder.com/300x200" 
         alt="Placeholder image" 
         title="Sample image">
    
    <a href="https://developer.mozilla.org" 
       title="Visit MDN Web Docs" 
       target="_blank">
        Learn more about HTML
    </a>
</body>
</html>`
        }
      }
    })

    console.log('   ✅ Created hierarchical content structure:')
    console.log('      - 1 Course: Complete Web Development Mastery')
    console.log('      - 4 Modules: HTML, CSS, JavaScript, Responsive Design')
    console.log('      - 1 Sample Lesson: HTML Structure and Elements')
    console.log('      - 3 Topics: Document Structure, Essential Elements, Attributes & Links')
    console.log('      - 4 Sub-topics with rich content and exercises')

    console.log('\n🎉 Hierarchical course seeding completed successfully!')
    console.log('\n📋 What was created:')
    console.log('   • Course with proper metadata and pricing')
    console.log('   • Module structure for organized learning')
    console.log('   • Lesson with hierarchical topics and sub-topics')
    console.log('   • Rich content with theory, code examples, and videos')
    console.log('   • Interactive exercises with starter/solution code')
    console.log('   • Proper content types (reading, video, exercise)')

    console.log('\n🎯 Next steps:')
    console.log('   1. Start the development server: npm run dev')
    console.log('   2. Visit: /admin/lessons/' + htmlLesson.id + '/topics')
    console.log('   3. Test the hierarchical content management')
    console.log('   4. Visit: /courses/complete-web-development-mastery/learn')
    console.log('   5. Experience the student learning interface')

  } catch (error) {
    console.error('❌ Error seeding hierarchical course:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })