
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const courseSlug = 'complete-web-development-mastery'
  console.log(`Deepening content for: ${courseSlug}`)

  // 1. Get the course
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug }
  })

  if (!course) {
    console.error('Course not found!')
    return
  }

  // 2. Create Modules
  console.log('Creating modules...')
  
  // Module 1: HTML Fundamentals
  const modHtml = await prisma.module.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'html-fundamentals' } },
    update: {},
    create: {
      courseId: course.id,
      title: 'HTML Fundamentals',
      slug: 'html-fundamentals',
      order: 0,
    }
  })

  // Module 2: CSS Styling
  const modCss = await prisma.module.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'css-styling' } },
    update: {},
    create: {
      courseId: course.id,
      title: 'CSS Styling & Layouts',
      slug: 'css-styling',
      order: 1,
    }
  })

  // Module 3: JavaScript Basics
  const modJs = await prisma.module.upsert({
    where: { courseId_slug: { courseId: course.id, slug: 'js-basics' } },
    update: {},
    create: {
      courseId: course.id,
      title: 'JavaScript Basics',
      slug: 'js-basics',
      order: 2,
    }
  })

  // 3. Create Lessons
  console.log('Creating lessons...')

  // Lesson: Semantic HTML (HTML Module)
  await createLesson(course.id, modHtml.id, {
    title: 'Semantic HTML5',
    slug: 'semantic-html5',
    order: 1,
    description: 'Learn why semantic elements matter for SEO and accessibility',
    content: {
      type: 'reading',
      theory: '# Semantic HTML\n\nSemantic HTML elements clearly describe their meaning in a human- and machine-readable way.\n\n### Why use them?\n1. **Accessibility**: Screen readers can navigate better.\n2. **SEO**: Search engines understand structure.\n3. **Maintainability**: Code is easier to read.\n\nExamples:\n- `<header>` instead of `<div id="header">`\n- `<article>` for blog posts\n- `<nav>` for navigation links',
      codeExample: {
        html: '<article>\n  <header>\n    <h1>My Blog Post</h1>\n    <p>Published on Dec 2025</p>\n  </header>\n  <p>This is the content of the post...</p>\n</article>',
        css: 'article { max-width: 600px; margin: 0 auto; }',
        js: '// No JS needed for structure!'
      }
    }
  })

  // Lesson: Forms (HTML Module)
  await createLesson(course.id, modHtml.id, {
    title: 'Building Forms',
    slug: 'html-forms',
    order: 2,
    description: 'Create interactive forms to collect user data',
    content: {
      type: 'exercise',
      theory: 'Forms allow users to send data to your server. Key elements include `<input>`, `<select>`, `<textarea>`, and `<button>`.',
      codeExample: {
        html: '<form>\n  <label>Email:\n    <input type="email" required />\n  </label>\n  <button type="submit"> proper Sign Up</button>\n</form>',
        css: 'form { display: flex; flex-direction: column; gap: 10px; }',
        js: ''
      }
    },
    exercises: [
      {
        title: 'Create a Login Form',
        description: 'Build a form with email and password inputs and a submit button.',
        starterCode: { html: '<form>\n  <!-- Your code here -->\n</form>', css: '', js: '' },
        solution: { html: '<form>\n  <input type="email" placeholder="Email" />\n  <input type="password" placeholder="Password" />\n  <button>Login</button>\n</form>', css: '', js: '' }
      }
    ]
  })

  // Lesson: Flexbox (CSS Module)
  await createLesson(course.id, modCss.id, {
    title: 'Flexbox Layouts',
    slug: 'css-flexbox',
    order: 0,
    description: 'Master alignment and distribution with Flexbox',
    content: {
      type: 'reading',
      theory: '## Flexbox\n\nFlexbox is a one-dimensional layout method for laying out items in rows or columns.\n\nKey properties:\n- `display: flex`\n- `justify-content` (main axis)\n- `align-items` (cross axis)',
      codeExample: {
        html: '<div class="container">\n  <div class="box">1</div>\n  <div class="box">2</div>\n  <div class="box">3</div>\n</div>',
        css: '.container { display: flex; gap: 10px; justify-content: center; }\n.box { width: 50px; height: 50px; background: blue; color: white; }',
        js: ''
      }
    }
  })

    // Lesson: JS Variables (JS Module)
    await createLesson(course.id, modJs.id, {
      title: 'Variables & Data Types',
      slug: 'js-variables',
      order: 0,
      description: 'Understanding let, const, and basic types',
      content: {
        type: 'video', // Placeholder for video type
        theory: 'In modern JavaScript, we use `let` and `const` instead of `var`.\n\n- `const`: for values that do not change.\n- `let`: for values that will change.',
        videoUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', // Example placeholder
        youtubeId: 'PkZNo7MFNFg'
      }
    })

  console.log('✅ Added comprehensive content to "Complete Web Development Mastery"')
}

async function createLesson(courseId, moduleId, data) {
  const { content, exercises, ...lessonData } = data
  
  // Create Lesson
  const lesson = await prisma.lesson.upsert({
    where: { slug: lessonData.slug },
    update: {
      ...lessonData,
      courseId,
      moduleId,
      status: 'PUBLISHED',
      publishedAt: new Date()
    },
    create: {
      ...lessonData,
      courseId,
      moduleId,
      status: 'PUBLISHED',
      publishedAt: new Date()
    }
  })

  // Create/Update Content
  if (content) {
    await prisma.lessonContent.upsert({
      where: { lessonId: lesson.id },
      update: {
        type: content.type,
        theory: content.theory,
        codeExample: content.codeExample ? JSON.stringify(content.codeExample) : undefined,
        videoUrl: content.videoUrl,
        youtubeId: content.youtubeId
      },
      create: {
        lessonId: lesson.id,
        type: content.type,
        theory: content.theory,
        codeExample: content.codeExample ? JSON.stringify(content.codeExample) : undefined,
        videoUrl: content.videoUrl,
        youtubeId: content.youtubeId
      }
    })
  }

  // Create Exercises if any
  if (exercises && exercises.length > 0) {
    // Clear existing for simplicity in seeding
    await prisma.lessonExercise.deleteMany({ where: { lessonId: lesson.id } })
    
    for (const ex of exercises) {
      await prisma.lessonExercise.create({
        data: {
          lessonId: lesson.id,
          title: ex.title,
          description: ex.description,
          starterCode: JSON.stringify(ex.starterCode),
          solution: JSON.stringify(ex.solution),
          order: 0
        }
      })
    }
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
